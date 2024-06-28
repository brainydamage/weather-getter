import {handler} from '../../weatherHandler';
import {mockClient} from 'aws-sdk-client-mock';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {fetchWeatherApi} from 'openmeteo';

const createMockWeatherApiResponse = (currentData: any, dailyData: any) => ({
  current: () => currentData,
  daily: () => dailyData,
  utcOffsetSeconds: () => 3600
});

jest.mock('openmeteo');
const s3Mock = mockClient(S3Client);

describe('Integration Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    s3Mock.reset();
  });

  const currentValid = {
    time: () => '1627902000',
    variables: (index: number) => ({
      value: () => [22.5, 800, 5.1, 200][index]
    })
  };

  const dailyValid = {
    time: () => '1722596400',
    timeEnd: () => '1722769200',
    interval: () => 86400,
    variables: (index: number) => ({
      valuesArray: () => [
        [800, 801],
        [22.5, 23.5],
        [15.5, 16.5]
      ][index]
    })
  };

  const currentPartial = {
    time: () => '1627902000',
    variables: (index: number) => ({
      value: () => [22.5, null, 5.1, 200][index]
    })
  };

  const dailyPartial1Level = {
    time: () => '1722596400',
    timeEnd: () => '1722769200',
    interval: () => 86400,
    variables: (index: number) => ({
      valuesArray: () => [
        [800, 801],
        null,
        [15.5, 16.5]
      ][index]
    })
  };

  const dailyPartial2Level = {
    time: () => '1722596400',
    timeEnd: () => '1722769200',
    interval: () => 86400,
    variables: (index: number) => ({
      valuesArray: () => [
        [800, 801],
        [22.5, 23.5],
        [15.5, null]
      ][index]
    })
  };

  const validMockResponse = createMockWeatherApiResponse(currentValid,
    dailyValid);
  const partialCurrentMockResponse = createMockWeatherApiResponse(
    currentPartial, dailyValid);
  const partialDaily1LevelMockResponse = createMockWeatherApiResponse(
    currentValid, dailyPartial1Level);
  const partialDaily2LevelMockResponse = createMockWeatherApiResponse(
    currentValid, dailyPartial2Level);
  const noCurrentMockResponse = createMockWeatherApiResponse(null, dailyValid);
  const noDailyMockResponse = createMockWeatherApiResponse(currentValid, null);
  const invalidMockResponse = {};

  describe('Successful scenarios', () => {
    it('should fetch weather data and upload to S3', async () => {
      (fetchWeatherApi as jest.Mock).mockResolvedValue([validMockResponse]);
      s3Mock.on(PutObjectCommand).resolves({});

      const result = await handler();

      expect(result.statusCode).toBe(200);
      expect(result.body)
        .toBe(JSON.stringify('Weather data uploaded successfully.'));
      expect(s3Mock.calls()).toHaveLength(3);
    });
  });

  describe('Error scenarios', () => {
    describe('Current data', () => {
      it('should handle missing current data from the weather API',
        async () => {
          (fetchWeatherApi as jest.Mock).mockResolvedValue(
            [noCurrentMockResponse]);

          const result = await handler();
          expect(result.statusCode).toBe(500);
          expect(result.body)
            .toBe(JSON.stringify({error: 'Failed to fetch weather data'}));
        });

      it('should handle partial current data returned from the weather API',
        async () => {
          (fetchWeatherApi as jest.Mock).mockResolvedValue(
            [partialCurrentMockResponse]);
          const result = await handler();
          expect(result.statusCode).toBe(500);
          expect(result.body)
            .toBe(JSON.stringify({error: 'Failed to fetch weather data'}));
        });
    });

    describe('Daily data', () => {
      it('should handle missing daily data from the weather API', async () => {
        (fetchWeatherApi as jest.Mock).mockResolvedValue([noDailyMockResponse]);

        const result = await handler();
        expect(result.statusCode).toBe(500);
        expect(result.body)
          .toBe(JSON.stringify({error: 'Failed to fetch weather data'}));
      });

      it(
        'should handle first level partial daily data returned from the weather API',
        async () => {
          (fetchWeatherApi as jest.Mock).mockResolvedValue(
            [partialDaily1LevelMockResponse]);
          const result = await handler();
          expect(result.statusCode).toBe(500);
          expect(result.body)
            .toBe(JSON.stringify({error: 'Failed to fetch weather data'}));
        });

      it(
        'should handle second lever partial daily data returned from the weather API',
        async () => {
          (fetchWeatherApi as jest.Mock).mockResolvedValue(
            [partialDaily2LevelMockResponse]);
          const result = await handler();
          expect(result.statusCode).toBe(500);
          expect(result.body)
            .toBe(JSON.stringify({error: 'Failed to fetch weather data'}));
        });
    });

    it('should handle if no data returned from the weather API', async () => {
      (fetchWeatherApi as jest.Mock).mockResolvedValue([]);
      const result = await handler();
      expect(result.statusCode).toBe(500);
      expect(result.body)
        .toBe(JSON.stringify({error: 'Failed to fetch weather data'}));
    });

    it('should handle invalid API response format', async () => {
      (fetchWeatherApi as jest.Mock).mockResolvedValue([invalidMockResponse]);

      const result = await handler();
      expect(result.statusCode).toBe(500);
      expect(result.body)
        .toBe(JSON.stringify({error: 'Failed to fetch weather data'}));
    });

    it('should handle S3 upload failure', async () => {
      (fetchWeatherApi as jest.Mock).mockResolvedValue([validMockResponse]);
      s3Mock.on(PutObjectCommand).rejects(new Error('S3 upload failed'));

      const result = await handler();
      expect(result.statusCode).toBe(500);
      expect(result.body)
        .toBe(JSON.stringify({error: 'Failed to fetch weather data'}));
    });
  });
});
