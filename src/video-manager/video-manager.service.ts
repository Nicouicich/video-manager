import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { VideoDto } from './dto/video.dto';
import { Video } from './entities/videos.entity';

@Injectable()
export class VideoManagerService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });
  constructor(
    @InjectModel(Video.name) private readonly videoModel: Model<Video>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async upload(files: Express.Multer.File[], user: UserDto) {
    try {
      const videos: Video[] = [];
      await Promise.all(
        files.map(async (file) => {
          try {
            await this.s3Client.send(
              new PutObjectCommand({
                Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
                Key: file.originalname,
                Body: file.buffer,
              }),
            );
            videos.push(new Video(file.originalname, '', user._id, file.size, file.mimetype, 0));
          } catch (error) {
            console.log(error);
          }
        }),
      );
      if (videos.length) {
        const documents = await this.videoModel.insertMany(videos);
        const videoIds = documents.map((doc) => doc._id);
        await this.userService.addVideosToUser(user._id, videoIds);
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async createVideo(video: Video) {
    return await new this.videoModel(video).save();
  }

  async getVideoByTitle(title: string): Promise<{ url: string }> {
    const videoDb = await this.videoModel.findOne({ title }).lean();
    if (!videoDb) return null;
    const fileName = videoDb.title.replace(/\s/g, '%20');
    return { url: `${this.configService.getOrThrow('AWS_CDN_URL')}${fileName}` };
  }

  async getAllVideos() {
    const videos = await this.videoModel.find().populate('userId').lean();

    return await Promise.all(
      videos?.length
        ? videos.map(async (video) => {
            const url = `${this.configService.getOrThrow('AWS_CDN_URL')}${video.title.replace(/\s/g, '%20')}`;
            let userDb: User = null;
            let user = {};

            if ((video.userId as unknown as User)?.username) {
              userDb = video.userId as unknown as User;
              user = {
                username: userDb.username,
                email: userDb.email,
              };
            } else {
              user = null;
            }
            return {
              url,
              id: video._id,
              title: video.title,
              createdAt: video.createdAt,
              description: video.description,
              user,
            };
          })
        : [],
    );
  }

  async deleteVideo(id: string, user: UserDto) {
    const video = await this.videoModel.findOne({ _id: id }).lean();
    if (!video) throw new NotFoundException('Video not found');
    if (video.userId === user._id || user.admin) {
      await Promise.all([
        this.userService.removeVideoFromUser(video.userId, video._id),
        this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
            Key: video.title,
          }),
        ),
        this.videoModel.deleteOne({ _id: id }),
      ]);
    }
  }

  //this should be findone and update
  async updateVideo(id: string, title: string, user: UserDto): Promise<Video> {
    const video = await this.videoModel.findOne({ _id: id }).lean();
    if (!video) throw new NotFoundException('Video not found');
    if (video.userId === user._id || user.admin) {
      await Promise.all([
        this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
            Key: video.title,
          }),
        ),
        this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
            Key: title,
          }),
        ),
        this.videoModel.updateOne({ _id: id }, { title }),
      ]);
      return { ...video, title };
    }
    return video;
  }
}
