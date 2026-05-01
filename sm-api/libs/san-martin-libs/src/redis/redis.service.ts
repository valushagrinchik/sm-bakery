import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { VerificationName } from '@san-martin/san-martin-libs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key: string) {
    return this.cache.get(key);
  }

  async set(key: string, value: unknown, ttl?: number) {
    return this.cache.set(key, value, {
      ttl,
    } as any);
  }

  async setVerificationEmailCode(userId: number, code: string, ttl?: number) {
    return this.cache.set(`${userId}${VerificationName.USER_EMAIL_VERIFY}`, code, {
      ttl,
    } as any);
  }

  async getVerificationEmailCode(userId: number): Promise<string> {
    return this.cache.get(`${userId}${VerificationName.USER_EMAIL_VERIFY}`);
  }

  async delVerificationEmailCode(userId: number) {
    return this.cache.del(`${userId}${VerificationName.USER_EMAIL_VERIFY}`);
  }

  async setResetPasswordCode(userId: number, code: string, ttl?: number) {
    return this.cache.set(`${userId}${VerificationName.USER_PASSWORD_RESET}`, code, {
      ttl,
    } as any);
  }

  async getResetPasswordCode(userId: number): Promise<string> {
    return this.cache.get(`${userId}${VerificationName.USER_PASSWORD_RESET}`);
  }

  async delResetPasswordCode(userId: number) {
    return this.cache.del(`${userId}${VerificationName.USER_PASSWORD_RESET}`);
  }

  async setSmsCode(userId: number, code: string, ttl?: number) {
    return this.cache.set(`${userId}${VerificationName.USER_PHONE_VERIFY}`, code, {
      ttl,
    } as any);
  }

  async getSmsCode(userId: number): Promise<string> {
    return this.cache.get(`${userId}${VerificationName.USER_PHONE_VERIFY}`);
  }

  async delSmsCode(userId: number) {
    return this.cache.del(`${userId}${VerificationName.USER_PHONE_VERIFY}`);
  }

  async del(key: string) {
    return this.cache.del(key);
  }

  async clearRouteCache(routeName: string) {
    const routeCache = await this.cache.store.keys(`*${routeName}*`);

    routeCache.forEach((key) => this.cache.del(key));
  }

  cleatFullCache() {
    this.cache.reset().then();
  }
}
