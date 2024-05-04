import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { Video } from './entities/videos.entity';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class VideoManagerService {
    private readonly s3Client = new S3Client({
        region: this.configService.getOrThrow('AWS_S3_REGION'),
    });
    constructor (
        @InjectModel(Video.name) private readonly videoModel: Model<Video>,
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    async upload(files: Express.Multer.File[], user: UserDto) {
        const videos: Video[] = [];
        await Promise.all(files.map(async file => {
            try {
                await this.s3Client.send(new PutObjectCommand({
                    Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
                    Key: file.originalname,
                    Body: file.buffer,
                }));
                videos.push(new Video(file.originalname, '', user._id, file.size, file.mimetype));

            } catch (error) {
                console.log(error);
            }
        }));
        if (videos.length) {
            const documents = await this.videoModel.insertMany(videos);
            const videoIds = documents.map(doc => doc._id);
            await this.userService.addVideosToUser(user._id, videoIds);
        }
    }

    async createVideo(video: Video) {
        return await new this.videoModel(video).save();
    }

    async getVideoById(id: string): Promise<{ url: string; }> {
        const videoDb = await this.videoModel.findOne({ _id: id }).lean();
        if (!videoDb) return null;
        const fileName = videoDb.title.replace(/\s/g, '%20');
        return { url: `${this.configService.getOrThrow('AWS_CDN_URL')}${fileName}` };
    }

}
