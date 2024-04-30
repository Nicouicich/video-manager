import { Module } from '@nestjs/common';
import { VideoManagerService } from './video-manager.service';
import { VideoManagerController } from './video-manager.controller';

@Module({
  providers: [VideoManagerService],
  controllers: [VideoManagerController]
})
export class VideoManagerModule {}
