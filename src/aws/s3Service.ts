import {S3} from '@aws-sdk/client-s3';
import {CurrentWeatherData, DailyWeatherData} from '../interfaces/interfaces';
import {config} from '../constants/config';
import {S3UploadError} from '../errors/appErrors';
import {messages} from '../constants/messages';

export class S3Manager {
  private s3: S3;
  private readonly bucketName: string;
  private readonly dailyPrefix: string;
  private readonly currentPrefix: string;
  private readonly contentType: string;

  constructor(region: string, bucketName: string) {
    this.s3 = new S3({region});
    this.bucketName = bucketName;
    this.dailyPrefix = config.dailyPrefix;
    this.currentPrefix = config.currentPrefix;
    this.contentType = config.contentType;
  }

  async uploadDataToS3(data: CurrentWeatherData | DailyWeatherData[]): Promise<void> {
    if (Array.isArray(data)) {
      for (const item of data) {
        const dateFormatted = item.date.split('T')[0];
        const itemKey = `${this.dailyPrefix}-${dateFormatted}.json`;
        const params = {
          Bucket: this.bucketName,
          Key: itemKey,
          Body: JSON.stringify(item),
          ContentType: this.contentType,
        };
        await this.upload(params, itemKey);
      }
    } else {
      const itemKey = `${this.currentPrefix}.json`;
      const params = {
        Bucket: this.bucketName,
        Key: itemKey,
        Body: JSON.stringify(data),
        ContentType: this.contentType,
      };
      await this.upload(params, itemKey);
    }
  }

  private async upload(params: {
    Bucket: string;
    Key: string;
    Body: string;
    ContentType: string;
  }, key: string): Promise<void> {
    try {
      await this.s3.putObject(params);
      console.log(`${messages.success.dataUploaded(params.Bucket, key)}`);
    } catch (error) {
      console.error(messages.errors.failedUploadDataBucket(params.Bucket, key),
        error);
      throw new S3UploadError(messages.errors.failedUploadData(error));
    }
  }
}