import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
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
    @IsString()
    @Length(3, 20)
    username: string;

    @ApiProperty({
        description: 'Password of the user',
        type: String,
        example: 'password123',
    })
    @IsString()
    @Length(8, 20)
    password: string;
}