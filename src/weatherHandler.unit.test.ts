import { fetchWeatherData } from './api/openMeteoService';
import { S3Manager } from './aws/s3Service';
import { config } from './constants/config';
import {
  processCurrentWeather,
  processDailyWeather,
} from './weather/weatherProcessing';
import { CurrentWeatherData, DailyWeatherData } from './interfaces/interfaces';
import { WeatherApiResponse } from '@openmeteo/sdk/weather-api-response';
import { handler } from './weatherHandler';
import { IncompleteDataError } from './errors/appErrors';
import { messages } from './constants/messages';

jest.mock('./api/openMeteoService');
jest.mock('./aws/s3Service');
jest.mock('./weather/weatherProcessing');

const mockFetchWeatherData = fetchWeatherData as jest.MockedFunction<
  typeof fetchWeatherData
>;
const mockProcessCurrentWeather = processCurrentWeather as jest.MockedFunction<
  typeof processCurrentWeather
>;
const mockProcessDailyWeather = processDailyWeather as jest.MockedFunction<
  typeof processDailyWeather
>;
const mockS3Manager = S3Manager as jest.Mock<S3Manager>;

describe('WeatherHandler', () => {
  const mockCurrentWeatherData: CurrentWeatherData = {
    time: '2021-08-02T16:00:00.000Z',
    temperature: 22.5,
    weatherCode: 800,
    windSpeed: 5.1,
    windDirection: 200,
  };

  const mockDailyWeatherData: DailyWeatherData[] = [
    {
      date: '2021-08-02T16:00:00.000Z',
      weatherCode: 800,
      temperatureMax: 22.5,
      temperatureMin: 15.5,
    },
    {
      date: '2021-08-03T16:00:00.000Z',
      weatherCode: 801,
      temperatureMax: 23.5,
      temperatureMin: 16.5,
    },
  ];

  const mockWeatherApiResponse = {
    current: () => ({
      time: () => '1627902000',
      variables: (index: number) => ({
        value: () => [22.5, 800, 5.1, 200][index],
      }),
    }),
    daily: () => ({
      time: () => '1627902000',
      timeEnd: () => '1628000000',
      interval: () => 86400,
      variables: (index: number) => ({
        valuesArray: () =>
          [
            [800, 801],
            [22.5, 23.5],
            [15.5, 16.5],
          ][index],
      }),
    }),
    utcOffsetSeconds: () => 3600,
  } as unknown as WeatherApiResponse;

  beforeEach(() => {
    jest.clearAllMocks();

    mockFetchWeatherData.mockResolvedValue(mockWeatherApiResponse);
    mockProcessCurrentWeather.mockReturnValue(mockCurrentWeatherData);
    mockProcessDailyWeather.mockReturnValue(mockDailyWeatherData);

    (mockS3Manager.prototype.uploadDataToS3 as jest.Mock).mockResolvedValue(
      void 0,
    );
  });

  describe('Success scenarios', () => {
    it('should handle weather data successfully', async () => {
      const result = await handler();

      expect(mockFetchWeatherData).toHaveBeenCalledWith(config.apiUrl, {
        latitude: config.latitude,
        longitude: config.longitude,
        current: config.currentParams,
        daily: config.dailyParams,
        timezone: config.timezone,
      });

      expect(mockProcessCurrentWeather).toHaveBeenCalledWith(
        mockWeatherApiResponse,
      );
      expect(mockProcessDailyWeather).toHaveBeenCalledWith(
        mockWeatherApiResponse,
      );

      expect(mockS3Manager.prototype.uploadDataToS3).toHaveBeenCalledWith(
        mockCurrentWeatherData,
      );
      expect(mockS3Manager.prototype.uploadDataToS3).toHaveBeenCalledWith(
        mockDailyWeatherData,
      );

      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify(messages.success.weatherDataUploaded),
      });
    });
  });

  describe('Error scenarios', () => {
    it('should return 500 if fetchWeatherData throws an error', async () => {
      mockFetchWeatherData.mockRejectedValueOnce(new Error('Fetch error'));

      const result = await handler();

      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({ error: messages.errors.failedFetchWeather }),
      });
    });

    it('should return 500 if processCurrentWeather throws an error', async () => {
      mockProcessCurrentWeather.mockImplementationOnce(() => {
        throw new IncompleteDataError('');
      });

      const result = await handler();

      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({ error: messages.errors.failedFetchWeather }),
      });
    });

    it('should return 500 if processDailyWeather throws an error', async () => {
      mockProcessDailyWeather.mockImplementationOnce(() => {
        throw new IncompleteDataError('');
      });

      const result = await handler();

      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({ error: messages.errors.failedFetchWeather }),
      });
    });

    it('should return 500 if uploadDataToS3 throws an error', async () => {
      (
        mockS3Manager.prototype.uploadDataToS3 as jest.Mock
      ).mockRejectedValueOnce(new Error('Upload error'));

      const result = await handler();

      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({ error: messages.errors.failedFetchWeather }),
      });
    });
  });
});
