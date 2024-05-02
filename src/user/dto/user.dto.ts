import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";

export class UserDto {
    @ApiProperty({ type: mongoose.Types.ObjectId })
    _id?: mongoose.Types.ObjectId;
    @ApiProperty({ type: String })
    username: string;
    @ApiProperty({ type: String })
    email: string;
    @ApiProperty()
    admin: boolean;
    @ApiProperty({ type: Array })
    videos: mongoose.Types.ObjectId[];
}

