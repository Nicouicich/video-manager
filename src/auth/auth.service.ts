import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { generateRandomPassword } from 'utils/pass-random';
import { UserDto } from 'src/user/dto/user.dto';
import { Request } from 'express';
import { LoginResponseDto, UserAuthDto } from './dto/login-response.dto';
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser({ username, password }: AuthPayloadDto): Promise<UserDto> {
        const user: User = await this.userService.getUserByUsername(username);
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        const { password: _, ...result } = user;
        return result;
    }

    login(user: UserDto) {
        return {
            access_token: this.jwtService.sign(user),
        };
    }

    async createUser(createUserDto: CreateUserDto, req: Request) {

        const newUser: User = await this.userService.createUser(createUserDto);
        const { password, ...result } = newUser;
        req.user = result;
        const token = this.jwtService.sign(result);
        return { token };
    }

    async validateGoogleUser({ email, displayName }: any): Promise<UserAuthDto> {
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            const password = generateRandomPassword();
            const newUser = Object(await this.userService.createUser({ email, username: displayName, password, profileImg: '' }));
            const { password: _, ...result } = newUser;
            // return {
            //     ...result,
            //     token: this.jwtService.sign(result)
            // };
            return result;
        }
        const { password: _, ...result } = user;
        return result;
        // return {
        //     user: result,
        //     token: this.jwtService.sign(result)
        // };
    }

    verifyToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (e) {
            return null;
        }
    }

    createToken(user: User): { token: string; } {
        const { password, ...result } = user;
        return { token: this.jwtService.sign(result) };
    }

    getUserFromJwt(token: string): UserDto {
        return this.jwtService.decode(token) as UserDto;
    }

    isTokenExpiring(token: string): boolean {
        const decoded = this.jwtService.decode(token) as any;
        return decoded.exp - Date.now() / 1000 < 60 * 60 * 24 * 3;
    }

    refreshToken(token: string): { access_token: string; } {
        const decoded = this.jwtService.decode(token) as any;
        const user = this.userService.getUserByUsername(decoded.username);
        return { access_token: this.jwtService.sign(user) };
    }

}
