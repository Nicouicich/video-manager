import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class VideoUploaderGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return false;
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = this.authService.verifyToken(token);
        request.user = decodedToken;
        return decodedToken?.admin;
    }
}