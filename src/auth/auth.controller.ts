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
import { User } from 'src/user/entities/user.entity';
import { UnauthorizedExceptionInterceptor } from 'libs/interceptors/invalid-credentials.interceptor';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('login')
    @UseGuards(LocalGuard)
    @UseInterceptors(UnauthorizedExceptionInterceptor)
    @ApiProperty({ type: AuthPayloadDto })
    login(@Req() req: Request, @Res() res: Response) {
        const token = this.authService.login(req.user as UserDto);
        res.setHeader('Authorization', `Bearer ${token.access_token}`);
        res.cookie('jwt', token.access_token, {
            httpOnly: true,
            // Deberías usar 'secure: true' en producción para enviar la cookie sólo sobre HTTPS
            secure: false,
            // sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 semana
        });
        res.json({ user: req.user, token: token.access_token });
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
    @Post('register')
    @ApiOperation({ summary: 'Create a new user' })
    @UseInterceptors(UsernameAlreadyExistsInterceptor)
    @UseInterceptors(EmailAlreadyExistsInterceptor)
    async createUser(@Body() createUserDto: CreateUserDto,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { token } = await this.authService.createUser(createUserDto, req);

        res.setHeader('Authorization', `Bearer ${token}`);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false,
            // sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 semana
        });
        res.json({ user: req.user, token: token });
    }

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    handleGoogleLogin() {}

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    async googleLoginRedirect(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { token } = this.authService.createToken(req.user as User);
        res.setHeader('Authorization', `Bearer ${token}`);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false,
            // sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 semana
        });
        // res.json({ user: req.user, token: token });
        res.redirect(`http://localhost:4000/login?token=${token}`);
    }
}
