import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';

type ResponseBody = Record<string, unknown>;
@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //tap see all data not chg data
    //map chg response data
    return next.handle().pipe(
      map((response: ResponseBody) => ({
        apiVersion: this.configService.get<string>('database.apiVersion'),
        data: response.data ?? response,
      })),
    );
  }
}
