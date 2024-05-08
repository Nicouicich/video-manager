import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { UserService } from "src/user/user.service";
import { AuthService } from "../auth.service";
import { UserAuthDto } from "../dto/login-response.dto";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly jwtService: JwtService
    ) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get('GOOGLE_REDIRECT_URL'),
            passReqToCallback: true,
            scope: ['profile', 'email'],
        });
    }

    async validate(
        request: any,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any) => void,
    ): Promise<any> {
        try {
            const { emails, displayName } = profile;
            const email = emails[0].value;
            const userData: UserAuthDto = await this.authService.validateGoogleUser({ email, displayName });
            request.user = userData;
            done(null, userData);
            // return userData;
        } catch (error) {
            done(error, false);
        }
    }
}