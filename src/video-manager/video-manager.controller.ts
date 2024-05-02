import { Controller, Get, NotFoundException, Param, Post, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { UserDto } from 'src/user/dto/user.dto';
import { VideoManagerService } from './video-manager.service';
import { VideoUploaderGuard } from 'src/guards/video-uploader.guard';


@Controller('video')
export class VideoManagerController {
    constructor (private readonly videoManagerService: VideoManagerService) {}

    @Post()
    @UseGuards(VideoUploaderGuard)
    @UseInterceptors(FilesInterceptor('files'))
    async uploadVideo(@UploadedFiles() files: Array<Express.Multer.File>,
        @Req() req: Request
    ) {
        await this.videoManagerService.upload(files, req.user as UserDto);
    }

    @Get(':id')
    async getVideo(@Param('id') id: string) {
        return await this.videoManagerService.getVideoById(id);

    }

}
