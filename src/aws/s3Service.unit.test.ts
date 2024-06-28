import {S3Manager} from './s3Service';
import {mockClient} from 'aws-sdk-client-mock';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {S3UploadError} from '../errors/appErrors';
import {DailyWeatherData} from '../interfaces/interfaces';

const s3Mock = mockClient(S3Client);

describe('S3Manager', () => {
  beforeEach(() => {
    s3Mock.reset();
  });

  it('should upload current weather data to S3 successfully', async () => {
    s3Mock.on(PutObjectCommand).resolves({ETag: 'mock-etag'});

    const s3Manager = new S3Manager('test-region', 'test-bucket');
    const data = {
      time: '2024-06-27T00:00:00.000Z',
      temperature: 25,
      weatherCode: 1,
      windSpeed: 10,
      windDirection: 100,
    };

    await expect(s3Manager.uploadDataToS3(data)).resolves.not.toThrow();
  });

  it('should upload daily weather data to S3 successfully', async () => {
    s3Mock.on(PutObjectCommand).resolves({ETag: 'mock-etag'});

    const s3Manager = new S3Manager('test-region', 'test-bucket');
    const data: DailyWeatherData[] = [
      {
        date: '2024-06-27T00:00:00.000Z',
        temperatureMax: 30,
        temperatureMin: 20,
        weatherCode: 1
      },
      {
        date: '2024-06-28T00:00:00.000Z',
        temperatureMax: 32,
        temperatureMin: 22,
        weatherCode: 2
      }
    ];

    await expect(s3Manager.uploadDataToS3(data)).resolves.not.toThrow();
  });

  it('should throw S3UploadError on current weather data upload failure',
    async () => {
      s3Mock.on(PutObjectCommand).rejects(new Error('Upload error'));

      const s3Manager = new S3Manager('test-region', 'test-bucket');
      const data = {
        time: '2024-06-27T00:00:00.000Z',
        temperature: 25,
        weatherCode: 1,
        windSpeed: 10,
        windDirection: 100
      };

      await expect(s3Manager.uploadDataToS3(data)).rejects
        .toThrow(S3UploadError);
    });

  it('should throw S3UploadError on daily weather data upload failure',
    async () => {
      s3Mock.on(PutObjectCommand).rejects('');

      const s3Manager = new S3Manager('test-region', 'test-bucket');
      const data: DailyWeatherData[] = [
        {
          date: '2024-06-27T00:00:00.000Z',
          temperatureMax: 30,
          temperatureMin: 20,
          weatherCode: 1
        },
        {
          date: '2024-06-28T00:00:00.000Z',
          temperatureMax: 32,
          temperatureMin: 22,
          weatherCode: 2
        }
      ];

      await expect(s3Manager.uploadDataToS3(data)).rejects
        .toThrow(S3UploadError);
    });
});