import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { UserDto } from 'src/user/dto/user.dto';
import { VideoManagerService } from './video-manager.service';
import { VideoUploaderGuard } from 'src/guards/video-uploader.guard';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { VideoDto } from './dto/video.dto';


@Controller('video')
export class VideoManagerController {
	constructor(private readonly videoManagerService: VideoManagerService) {}

	@Post()
	@UseGuards(VideoUploaderGuard)
	@UseInterceptors(FilesInterceptor('files'))
	async uploadVideo(@UploadedFiles() files: Array<Express.Multer.File>,
		@Req() req: Request
	) {
		await this.videoManagerService.upload(files, req.user as UserDto);
	}

	@Get(':title')
	@UseGuards(JwtAuthGuard)
	async getVideo(@Param('title') title: string) {
		return await this.videoManagerService.getVideoByTitle(title);
	}

	@Get('')
	@UseGuards(JwtAuthGuard)
	async getAllVideos() {
		return await this.videoManagerService.getAllVideos();
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	async deleteVideo(@Param('id') id: string,
		@Req() req: Request
	) {
		return await this.videoManagerService.deleteVideo(id, req.user as UserDto);
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	async updateVideo(
		@Param('id') id: string,
		@Body() title: string,
		@Req() req: Request
	) {
		return await this.videoManagerService.updateVideo(id, title, req.user as UserDto);
	}


}
