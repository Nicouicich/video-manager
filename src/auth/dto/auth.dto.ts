import { ApiProperty } from "@nestjs/swagger";

export class AuthPayloadDto {
    @ApiProperty({ required: true, example: 'test' })
    username: string;

    @ApiProperty({ required: true, example: 'test' })
    password: string;
}