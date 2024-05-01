import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { LocalGuard } from '../guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { EmailAlreadyExistsInterceptor, UsernameAlreadyExistsInterceptor } from 'libs/interceptors/duplicated-user.interceptor';
import { GoogleAuthGuard } from 'src/guards/google.guard';
@Controller('auth')
export class AuthController {

    constructor (
        private readonly authService: AuthService,
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
        if (req.user) {
            return { msg: 'Authorized' };
        } else {
            return { msg: 'not authorized' };
        }
    }

    @ApiCreatedResponse({ description: 'The user has been successfully created.' })
    @ApiBadRequestResponse({ description: 'Bad request.' })
    @Post('create')
    @ApiOperation({ summary: 'Create a new user' })
    @UseInterceptors(UsernameAlreadyExistsInterceptor)
    @UseInterceptors(EmailAlreadyExistsInterceptor)
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.authService.createUser(createUserDto);
    }

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    handleGoogleLogin() {
        return { msg: 'Google Auth' };
        // return this.authService.googleLogin();
    }

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    googleLoginRedirect(@Req() req: Request) {
        console.log(req.user);
        return { msg: 'OK' };
        // return this.authService.googleLoginRedirect(req);
    }
}
