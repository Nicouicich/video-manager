
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/entities/user.entity';
import { DbConnectionModule } from './db-connection.module';

@Module({
    imports: [
        DbConnectionModule,
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ],
    exports: [
        MongooseModule
    ]
})

export class DbSchemasModule {}
