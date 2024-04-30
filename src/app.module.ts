import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DbConnectionModule } from './db/db-connection.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { VideoManagerModule } from './video-manager/video-manager.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DbConnectionModule,
    UserModule,
    AuthModule,
    VideoManagerModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: []
})
export class AppModule {}
