import { ApiProperty } from '@nestjs/swagger';
import mongoose, { mongo } from 'mongoose';

export class UserAuthDto {
  @ApiProperty()
  _id?: mongoose.Types.ObjectId;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  admin: boolean;
  @ApiProperty({ type: [mongoose.Types.ObjectId] })
  videos: mongoose.Types.ObjectId[];
}

export class LoginResponseDto {
  @ApiProperty({ type: UserAuthDto })
  user: UserAuthDto;
  @ApiProperty()
  token: string;
}