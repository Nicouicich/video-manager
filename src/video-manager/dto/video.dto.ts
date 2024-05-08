import { ApiProperty } from '@nestjs/swagger';

export class VideoDto {
  @ApiProperty({ type: String })
  url: string;
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  title: string;
  @ApiProperty({ type: Date })
  createdAt: Date;
  @ApiProperty({ type: String })
  description: string;
  @ApiProperty({ type: {} })
  user: {
    username: string,
    email: string;
  };
}
