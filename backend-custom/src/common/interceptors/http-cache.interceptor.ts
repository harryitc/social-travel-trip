import { CUSTOM_HTTP_CACHE_OPTIONS, ICustomCacheOptions } from '@common/decorators/custom-cache-options.decrator';
import { buildCacheKey } from '@common/helpers/build-cache-key';
import { flattenObject } from '@common/utils/flatten-object';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Injectable,
  ExecutionContext,
  NestInterceptor,
  CallHandler,
  Inject,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { catchError, of, tap } from 'rxjs';

@Injectable()
export class CustomHttpCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) { }

  public readonly logger = new Logger(CustomHttpCacheInterceptor.name);

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const defaultTTL = this.configService.get<number>('appConfig.defaultHttpCacheInterceptorTTL')
    const cacheOptions = this.reflector.get<ICustomCacheOptions>(
      CUSTOM_HTTP_CACHE_OPTIONS,
      context.getHandler(),
    );
    // Cache key prefix of class name:

    let cacheTTL = defaultTTL ?? 59; // second

    console.log(defaultTTL);

    let cacheKey = buildCacheKey(CustomHttpCacheInterceptor.name, [
      context.getClass().name,
      context.getHandler().name,
    ]).toLocaleLowerCase();

    let cachepermitAllUser = true;

    if (cacheOptions) {
      let { key, permitAllUser, ttl } = cacheOptions;
      if (key) {
        cacheKey = key;
      }
      if (ttl) {
        cacheTTL = ttl
      }
      if (permitAllUser != undefined) {
        cachepermitAllUser = permitAllUser
      }
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    let obj: any = {
      body: request.body,
      params: request.params,
      queries: request.query,
    };

    if (!cachepermitAllUser) {
      obj.user = request['user'];
    }
    const _cacheField = this.stringifyObject(flattenObject(obj));

    if (_cacheField) {
      cacheKey += ':' + _cacheField;
    }

    this.logger.log(`KEY: ${cacheKey} - TTL: ${cacheTTL * 1000} ms`);

    const fromCache = await this.cache.store.get<any>(cacheKey);

    if (fromCache) {
      return of(fromCache);
    }

    return next.handle().pipe(
      tap(async (response) => {
        await this.cache.store.set(cacheKey, response, cacheTTL * 1000);
      }),
    );
  }

  stringifyObject(obj: any): string {
    return Object.entries(obj)
      .map(([key, value]) => `${key}:${value}`)
      .join(':')
      .toLocaleLowerCase();
  }
}
