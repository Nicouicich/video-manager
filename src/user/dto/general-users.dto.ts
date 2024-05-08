import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class GeneralUserDto {
  @ApiProperty({
    description: 'Email of the user',
    type: String,
    example: 'example@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Username of the user',
    type: String,
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({
    description: 'Profile image URL of the user',
    type: String,
    example: 'https://example.com/profile.jpg',
  })
  @IsString()
  profileImgUrl: string;

  constructor(user: User) {
    this.email = user.email;
    this.username = user.username;
    this.profileImgUrl = user.profileImg;
  }
}