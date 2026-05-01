import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from '@san-martin/san-martin-libs';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface CacheOptions {
  ttl?: number;
  key?: string;
  condition?: (...args: any[]) => boolean;
}

export const CACHE_KEY_METADATA = 'cache_key';
export const CACHE_TTL_METADATA = 'cache_ttl';
export const CACHE_CONDITION_METADATA = 'cache_condition';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly redisService: RedisService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = this.reflector.get<string>(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );
    const cacheTtl = this.reflector.get<number>(
      CACHE_TTL_METADATA,
      context.getHandler(),
    );
    const cacheCondition = this.reflector.get<((...args: any[]) => boolean)>(
      CACHE_CONDITION_METADATA,
      context.getHandler(),
    );

    // Skip caching for POST, PUT, DELETE, PATCH requests
    if (!['GET'].includes(request.method)) {
      return next.handle();
    }

    // Skip if cache condition is not met
    if (cacheCondition && !cacheCondition(request)) {
      return next.handle();
    }

    // Generate cache key
    const key = cacheKey || this.generateCacheKey(request);
    
    try {
      // Try to get from cache
      const cachedResponse = await this.redisService.get(key);
      if (cachedResponse) {
        return of(JSON.parse(cachedResponse as string));
      }
    } catch (error) {
      // Cache miss or error, continue with request
    }

    // Execute request and cache response
    return next.handle().pipe(
      tap(async (response) => {
        try {
          await this.redisService.set(
            key,
            JSON.stringify(response),
            cacheTtl || 300, // Default 5 minutes
          );
        } catch (error) {
          // Cache write error, ignore
        }
      }),
    );
  }

  private generateCacheKey(request: any): string {
    const { url, query, headers } = request;
    const userId = headers['user-id'] || 'anonymous';
    const queryString = JSON.stringify(query || {});
    return `cache:${userId}:${url}:${queryString}`;
  }
}

export const Cache = (options: CacheOptions = {}) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (options.key) {
      Reflect.defineMetadata(CACHE_KEY_METADATA, options.key, descriptor.value);
    }
    if (options.ttl) {
      Reflect.defineMetadata(CACHE_TTL_METADATA, options.ttl, descriptor.value);
    }
    if (options.condition) {
      Reflect.defineMetadata(CACHE_CONDITION_METADATA, options.condition, descriptor.value);
    }
    return descriptor;
  };
};
