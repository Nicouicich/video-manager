

import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private authService: AuthService) {
        super();
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest(err, user, info: Error, context: ExecutionContext) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        const response = context.switchToHttp().getResponse();
        const { exp, iat, ...userData } = user;
        const newToken = this.authService.login(userData);
        response.setHeader('Authorization', `Bearer ${newToken.access_token}`);
        response.cookie('jwt', newToken.access_token, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 semana
        });

        return user;
    }

}