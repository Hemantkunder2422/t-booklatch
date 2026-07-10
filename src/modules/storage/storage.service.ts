import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';
import { UploadResult } from './interfaces/upload-result.interface';
import { Express } from 'express';
import { UploadFile } from './interfaces/upload-file.interface';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        )!,
      },
    });
  }

  async upload(
    file: UploadFile,
    folder: string,
    entityId: string,
  ): Promise<UploadResult> {
    const key = `${folder}/${entityId}/${randomUUID()}.webp`;
    const buffer = await sharp(file.buffer).rotate().resize({
      width: 1920,
      withoutEnlargement: true,
    });
    return {
      key: '',
      url: '',
    };
  }
}
