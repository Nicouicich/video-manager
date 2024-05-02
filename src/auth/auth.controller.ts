import { Body, Controller, Get, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { EmailAlreadyExistsInterceptor, UsernameAlreadyExistsInterceptor } from 'libs/interceptors/duplicated-user.interceptor';
import { GoogleAuthGuard } from 'src/guards/google.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { LocalGuard } from '../guards/local.guard';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { UserDto } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {

    constructor (
        private readonly authService: AuthService,
    ) {}

    @Post('login')
    @UseGuards(LocalGuard)
    @ApiProperty({ type: AuthPayloadDto })
    login(@Req() req: Request, @Res() res: Response) {
        const token = this.authService.login(req.user as UserDto);
        res.setHeader('Authorization', `Bearer ${token.access_token}`);
        console.log(token.access_token)
        res.json(req.user);
        // return req.user;
    }


    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiProperty({ type: AuthPayloadDto })
    logout(@Req() req: Request) {
        // Perform logout logic here
        return { msg: 'Logged out successfully' };
    }

    @ApiCreatedResponse({ description: 'The user has been successfully created.' })
    @ApiBadRequestResponse({ description: 'Bad request.' })
    @Post('create')
    @ApiOperation({ summary: 'Create a new user' })
    @UseInterceptors(UsernameAlreadyExistsInterceptor)
    @UseInterceptors(EmailAlreadyExistsInterceptor)
    createUser(@Body() createUserDto: CreateUserDto,
        @Req() req: Request
    ) {
        return this.authService.createUser(createUserDto, req);
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
        // console.log(req.user);
        return req.user;
        // return this.authService.googleLoginRedirect(req);
    }
}
