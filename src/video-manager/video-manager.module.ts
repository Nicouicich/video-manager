import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DbSchemasModule } from 'src/db/db-schemas.module';
import { UserService } from 'src/user/user.service';
import { VideoManagerController } from './video-manager.controller';
import { VideoManagerService } from './video-manager.service';

@Module({
  imports: [AuthModule,
    DbSchemasModule
  ],
  providers: [VideoManagerService, UserService],
  controllers: [VideoManagerController]
})
export class VideoManagerModule {}
