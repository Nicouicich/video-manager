import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({ type: String })
    username: string;
    @ApiProperty({ type: String })
    email: string;
    @ApiProperty()
    admin: boolean;
    @ApiProperty()
    token: string;
}