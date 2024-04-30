import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

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
}
