import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
require('dotenv').config();
@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  public get rabbitMQHost(): string {
    return this.configService.getOrThrow<string>('RABBIT_MQ_HOST');
  }

  public get database() {
    return {
      url: this.configService.getOrThrow<string>('DATABASE_URL'),
    };
  }

  public get testDatabase() {
    return {
      host: this.configService.getOrThrow<string>('TEST_DATABASE_HOST'),
      port: this.configService.getOrThrow<number>('TEST_DATABASE_PORT'),
      username: this.configService.getOrThrow<string>('TEST_DATABASE_USER_NAME'),
      password: this.configService.getOrThrow<string>('TEST_DATABASE_PASSWORD'),
      database: this.configService.getOrThrow<string>('TEST_DATABASE_NAME'),
    };
  }

  public get jwtSecret(): string {
    return this.configService.getOrThrow<string>('JWT_SECRET');
  }

  public get emailService() {
    return {
      brevoApiKey: this.configService.getOrThrow<string>('BREVO_API_KEY'),
      senderEmail: this.configService.getOrThrow<string>('SENDER_EMAIL'),
    };
  }

  public get redis(): { url: string; host: string; port: number; password: string } {
    // return this.configServices.getOrThrow<string>('REDIS_HOST');
    return {
      url: this.configService.getOrThrow<string>('REDIS_URL'),
      host: this.configService.getOrThrow<string>('REDIS_HOST'),
      port: this.configService.getOrThrow<number>('REDIS_PORT'),
      password: this.configService.getOrThrow<string>('REDIS_PASSWORD'),
    };
  }

  public get socialAuth(): {
    appleClientId: string;
    googleClientIdAndroid: string;
    googleClientIdIOS: string;
  } {
    return {
      appleClientId: this.configService.getOrThrow<string>('APPLE_CLIENT_ID'),
      googleClientIdAndroid: this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID_ANDROID'),
      googleClientIdIOS: this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID_IOS'),
    };
  }

  public get encryptKey(): { key: string; iv: string } {
    return {
      key: this.configService.getOrThrow<string>('ENCRYPT_KEY'),
      iv: this.configService.getOrThrow<string>('ENCRYPT_IV'),
    };
  }

  public get linkResetChange() {
    return this.configService.getOrThrow<string>('LINK_RESET_CHANGE');
  }

  public get awsAccessData(): { accessKeyId: string; secretKeyId: string; region: string } {
    return {
      accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
      secretKeyId: this.configService.getOrThrow<string>('AWS_SECRET_KEY_ID'),
      region: this.configService.getOrThrow<string>('AWS_REGION'),
    };
  }

  public get devEnvironment() {
    return this.configService.getOrThrow<string>('DEV_ENVIRONMENT');
  }

  public get getBullConnection(): { host: string; port: number } {
    return {
      host: this.configService.getOrThrow<string>('BULL_QUEUE_HOST'),
      port: this.configService.getOrThrow<number>('BULL_QUEUE_PORT'),
    };
  }

  public get getServerType(): string {
    return this.configService.getOrThrow<string>('SERVER_TYPE');
  }

  public get getInventoryApiUrl(): string {
    return this.configService.getOrThrow<string>('INVENTORY_API_URL');
  }

  public get getInventoryApiAuth(): string {
    return this.configService.getOrThrow<string>('INVENTORY_API_AUTH');
  }

  public get socketUrl(): string {
    return this.configService.getOrThrow<string>('SOCKET_URL');
  }

  public get firebase(): {
    type: string;
    projectId: string;
    privateKeyId: string;
    privateKey: string;
    clientEmail: string;
    clientId: string;
    authUri: string;
    tokenUri: string;
    authProviderX509CertUrl: string;
    clientX509CertUrl: string;
    universeDomain: string;
  } {
    return {
      type: this.configService.getOrThrow<string>('FB_TYPE'),
      projectId: this.configService.getOrThrow<string>('FB_PROJECT_ID'),
      privateKeyId: this.configService.getOrThrow<string>('FB_PRIVATE_KEY_ID'),
      privateKey: this.configService.getOrThrow<string>('FB_PRIVATE_KEY'),
      clientEmail: this.configService.getOrThrow<string>('FB_CLIENT_EMAIL'),
      clientId: this.configService.getOrThrow<string>('FB_CLIENT_ID'),
      authUri: this.configService.getOrThrow<string>('FB_AUTH_URI'),
      tokenUri: this.configService.getOrThrow<string>('FB_TOKEN_URI'),
      authProviderX509CertUrl: this.configService.getOrThrow<string>('FB_AUTH_CERT_URL'),
      clientX509CertUrl: this.configService.getOrThrow<string>('FB_CLIENT_CERT_URL'),
      universeDomain: this.configService.getOrThrow<string>('FB_UNIVERSAL_DOMAIN'),
    };
  }
}
