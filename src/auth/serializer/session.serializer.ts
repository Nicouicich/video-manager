import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { User } from "src/user/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { UserDto } from "src/user/dto/user.dto";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor (
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) {
        super();
    }

    serializeUser(userDto: UserDto, done: (err: Error, user: any) => void): any {
        done(null, userDto);
    }

    async deserializeUser(userData: UserDto, done: (err: Error, payload: any) => void): Promise<any> {
        const user = await this.userService.getUserByUsername(userData?.username);
        return user ? done(null, user) : done(null, null);
    }
}