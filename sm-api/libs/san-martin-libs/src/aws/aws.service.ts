import * as crypto from 'crypto';

import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AppConfigService } from '@san-martin/san-martin-libs';
import { StreamingBlobPayloadInputTypes } from '@smithy/types';
import * as dayjs from 'dayjs';

import { IErrorLogs } from '../common/types/logs';

@Injectable()
export class AwsService {
  private s3: S3;

  constructor(
    @Inject(forwardRef(() => AppConfigService)) private readonly appConfigService: AppConfigService,
  ) {
    this.s3 = new S3({
      region: this.appConfigService.awsAccessData.region,
      credentials: {
        accessKeyId: this.appConfigService.awsAccessData.accessKeyId,
        secretAccessKey: this.appConfigService.awsAccessData.secretKeyId,
      },
    });
  }

  async uploadUserImage(
    format: string,
    attachment: StreamingBlobPayloadInputTypes,
    ContentType: string,
  ) {
    const fileName = `${crypto.randomBytes(16).toString('hex')}.${format}`;

    const command = new PutObjectCommand({
      Bucket: 'san-martin-images-app',
      Key: `users/${this.appConfigService.devEnvironment}/${fileName}`,
      Body: attachment,
      ContentType,
    });
    try {
      await this.s3.send(command);

      return {
        url: `https://san-martin-images-app.sanmartinbakery.com/users/${this.appConfigService.devEnvironment}/${fileName}`,
        key: `users/${this.appConfigService.devEnvironment}/${fileName}`,
      };
    } catch (caught) {
      throw caught;
    }
  }

  async deleteImage(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: 'san-martin-images-app',
      Key: key,
    });

    try {
      await this.s3.send(command);
    } catch (caught) {
      throw caught;
    }
  }

  async copyImage(key: string, userId: number) {
    const newKey = key.replace(`users/${this.appConfigService.devEnvironment}/`, '');
    const command = new GetObjectCommand({
      Bucket: 'san-martin-images-app',
      Key: key,
    });

    try {
      const response = await this.s3.send(command);
      const byteArray = await response.Body.transformToByteArray();
      const buffer = Buffer.from(byteArray);
      const commandToCopy = new PutObjectCommand({
        Bucket: 'san-martin-images-app',
        Key: `users/${this.appConfigService.devEnvironment}/${userId}/${newKey}`,
        Body: buffer,
        ContentType: response.ContentType,
      });

      await this.s3.send(commandToCopy);

      return {
        url: `https://san-martin-images-app.sanmartinbakery.com/users/${this.appConfigService.devEnvironment}/${userId}/${newKey}`,
      };
    } catch (caught) {
      throw caught;
    }
  }

  async createErrorLogs(message: IErrorLogs): Promise<void> {
    try {
      const logs = await this.getErrorLogs();
      if (logs) {
        const contentString = await logs.Body?.transformToString();
        const content = contentString ? JSON.parse(contentString) : null;
        await this.setErrorLogs([...content, message]);
      }

      if (!logs) {
        await this.setErrorLogs([message]);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getErrorLogs() {
    try {
      const params = {
        Bucket: 'san-martin-logs-app',
        Key: `errors/error-${this.appConfigService.devEnvironment}-${dayjs().format(
          'YYYY-MM-DD',
        )}.json`,
      };

      return await this.s3.getObject(params);
    } catch (e) {
      return null;
    }
  }

  async setErrorLogs(
    attachment: Record<string, unknown>[],
    contentLength?: number,
    newMessage?: Record<string, unknown>[],
  ) {
    if (contentLength && contentLength >= 1000000) {
      const paramCopy = new PutObjectCommand({
        Bucket: 'san-martin-logs-app',
        Key: `errors/error-${this.appConfigService.devEnvironment}-${dayjs().format(
          'YYYY-MM-DDTHH:MM',
        )}.json`,
        Body: Buffer.from(JSON.stringify(attachment)),
        ContentEncoding: 'base64',
        // ContentDisposition: attachment.disposition,
        CacheControl: 'public, max-age=86400',
        ContentType: 'application/json; charset=utf-8',
        Tagging: 'report=true',
      });

      await this.s3.send(paramCopy);
      const deleteParam = new DeleteObjectCommand({
        Bucket: 'san-martin-logs-app',
        Key: `errors/error-${this.appConfigService.devEnvironment}-${dayjs().format(
          'YYYY-MM-DD',
        )}.json`,
      });
      await this.s3.send(deleteParam);

      const params = new PutObjectCommand({
        Bucket: 'san-martin-logs-app',
        Key: `errors/error-${this.appConfigService.devEnvironment}-${dayjs().format(
          'YYYY-MM-DD',
        )}.json`,
        Body: Buffer.from(JSON.stringify(newMessage)),
        ContentEncoding: 'base64',
        // ContentDisposition: attachment.disposition,
        CacheControl: 'public, max-age=86400',
        ContentType: 'application/json; charset=utf-8',
        Tagging: 'report=true',
      });

      return await this.s3.send(params);
    }

    const params = {
      Bucket: 'san-martin-logs-app',
      Key: `errors/error-${this.appConfigService.devEnvironment}-${dayjs().format(
        'YYYY-MM-DD',
      )}.json`,
      Body: Buffer.from(JSON.stringify(attachment)),
      ContentEncoding: 'base64',
      // ContentDisposition: attachment.disposition,
      CacheControl: 'public, max-age=86400',
      ContentType: 'application/json; charset=utf-8',
      Tagging: 'report=true',
    };

    return this.s3.send(new PutObjectCommand(params));
  }
}
