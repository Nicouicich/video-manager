import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { generateRandomPassword } from 'utils/pass-random';
import { UserDto } from 'src/user/dto/user.dto';

@Injectable()
export class AuthService {
    constructor (
        private readonly userService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser({ username, password }: AuthPayloadDto) {
        const user = await this.userService.getUserByUsername(username);
        if (!user) return null;

        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return this.jwtService.sign(result);
        }
        throw new Error('Invalid credentials');
    }

    async createUser(createUserDto: CreateUserDto) {

        const newUser: User = await this.userService.createUser(createUserDto);
        const { password, ...result } = newUser;
        const token = this.jwtService.sign(result);
        return { token };
    }

    async validateGoogleUser({ email, displayName }: any): Promise<UserDto> {
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            const password = generateRandomPassword();
            const newUser = Object(await this.userService.createUser({ email, username: displayName, password }));
            const { password: _, ...result } = newUser;
            return {
                ...result,
                token: this.jwtService.sign(result)
            };
        }
        const { password: _, ...result } = user;
        return {
            ...result,
            token: this.jwtService.sign(result)
        };
    }

}
