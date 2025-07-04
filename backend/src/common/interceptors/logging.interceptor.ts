import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(context.getHandler().name + ':Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            context.getHandler().name + `:After... ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
