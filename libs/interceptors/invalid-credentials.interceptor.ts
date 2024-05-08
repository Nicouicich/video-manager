import { CallHandler, Catch, ExecutionContext, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import { Observable, catchError } from "rxjs";

@Catch(UnauthorizedException)
export class UnauthorizedExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError(error => {
        if (error instanceof UnauthorizedException) throw new UnauthorizedException(`Invalid credentials`);
        throw error;
      })
    );
  }
}