import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { DbSchemasModule } from 'src/db/db-schemas.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    DbSchemasModule,
  ],
  controllers: [UserController],
  providers: [UserService],

})
export class UserModule {}
