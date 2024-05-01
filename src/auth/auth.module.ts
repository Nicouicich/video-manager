import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/entities/user.entity';
import { DbSchemasModule } from 'src/db/db-schemas.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { SessionSerializer } from './serializer/session.serializer';

@Module({
  imports: [
    DbSchemasModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' }
      })
    }),
    PassportModule.registerAsync({
      useFactory: () => ({
        defaultStrategy: 'jwt'
      })
    }),
    PassportModule.register({ session: true })
  ],
  controllers: [AuthController],
  providers: [AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    SessionSerializer
  ]
})
export class AuthModule {}
