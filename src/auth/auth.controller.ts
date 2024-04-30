import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { LocalGuard } from '../guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiProperty } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {

    constructor (
        private authService: AuthService
    ) {}

    @Post('login')
    @UseGuards(LocalGuard)
    @ApiProperty({ type: AuthPayloadDto })
    login(@Req() req: Request) {
        return req.user;
    }

    @Get('status')
    @UseGuards(JwtAuthGuard)
    status(@Req() req: Request) {
        return req.user;
    }
}
