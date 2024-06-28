import {WeatherApiResponse} from '@openmeteo/sdk/weather-api-response';
import {processCurrentWeather, processDailyWeather} from './weatherProcessing';
import {CurrentWeatherData, DailyWeatherData} from '../interfaces/interfaces';
import {DataNotAvailableError, IncompleteDataError} from '../errors/appErrors';

describe('Weather Processing', () => {
  describe('processCurrentWeather', () => {
    it('should process and return current weather data correctly', () => {
      const mockResponse = {
        current: () => ({
          time: () => '1627902000',
          variables: (index: number) => ({
            value: () => [22.5, 800, 5.1, 200][index]
          })
        }),
        utcOffsetSeconds: () => 3600
      } as unknown as WeatherApiResponse;

      const expectedData: CurrentWeatherData = {
        time: '2021-08-02T12:00:00.000Z',
        temperature: 22.5,
        weatherCode: 800,
        windSpeed: 5.1,
        windDirection: 200
      };

      const result = processCurrentWeather(mockResponse);

      expect(result).toEqual(expectedData);
    });

    it(
      'should throw DataNotAvailableError if no current weather data is available',
      () => {
        const mockResponse = {
          current: () => null,
          utcOffsetSeconds: () => 3600
        } as unknown as WeatherApiResponse;

        expect(() => processCurrentWeather(mockResponse))
          .toThrow(DataNotAvailableError);
      });

    it(
      'should throw IncompleteDataError if any current weather variable is missing',
      () => {
        const mockResponse = {
          current: () => ({
            time: () => '1627902000',
            variables: (index: number) => ({
              value: () => [22.5, null, 5.1, 200][index]
            })
          }),
          utcOffsetSeconds: () => 3600
        } as unknown as WeatherApiResponse;

        expect(() => processCurrentWeather(mockResponse))
          .toThrow(IncompleteDataError);
      });
  });

  describe('processDailyWeather', () => {
    it('should process and return daily weather data correctly', () => {
      const mockResponse = {
        daily: () => ({
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
        }),
        utcOffsetSeconds: () => 3600
      } as unknown as WeatherApiResponse;

      const expectedData: DailyWeatherData[] = [
        {
          date: '2024-08-02T12:00:00.000Z',
          weatherCode: 800,
          temperatureMax: 22.5,
          temperatureMin: 15.5
        },
        {
          date: '2024-08-03T12:00:00.000Z',
          weatherCode: 801,
          temperatureMax: 23.5,
          temperatureMin: 16.5
        }
      ];

      const result = processDailyWeather(mockResponse);
      expect(result).toEqual(expectedData);
    });

    it(
      'should throw DataNotAvailableError if no daily weather data is available',
      () => {
        const mockResponse = {
          daily: () => null,
          utcOffsetSeconds: () => 3600
        } as unknown as WeatherApiResponse;

        expect(() => processDailyWeather(mockResponse))
          .toThrow(DataNotAvailableError);
      });

    it(
      'should throw IncompleteDataError if any daily weather variable is missing',
      () => {
        const mockResponse = {
          daily: () => ({
            time: () => '1722596400',
            timeEnd: () => '1722769200',
            interval: () => 86400,
            variables: (index: number) => ({
              valuesArray: () => [
                [800, null],
                [22.5, 23.5],
                [15.5, 16.5]
              ][index]
            })
          }),
          utcOffsetSeconds: () => 3600
        } as unknown as WeatherApiResponse;

        expect(() => processDailyWeather(mockResponse))
          .toThrow(IncompleteDataError);
      });

    it('should throw IncompleteDataError if weatherValues is missing', () => {
      const mockResponse = {
        daily: () => ({
          time: () => '1722596400',
          timeEnd: () => '1722769200',
          interval: () => 86400,
          variables: (index: number) => {
            if (index === 1 || index === 2) {
              return {valuesArray: () => new Float32Array([0, 1])};
            }
            return null;
          }
        }),
        utcOffsetSeconds: () => 3600
      } as unknown as WeatherApiResponse;

      expect(() => processDailyWeather(mockResponse))
        .toThrow(IncompleteDataError);
    });

    it('should throw IncompleteDataError if tempMaxValues is missing', () => {
      const mockResponse = {
        daily: () => ({
          time: () => '1722596400',
          timeEnd: () => '1722769200',
          interval: () => 86400,
          variables: (index: number) => {
            if (index === 0) {
              return {valuesArray: () => new Float32Array([0, 1])};
            }
            if (index === 2) {
              return {valuesArray: () => new Float32Array([0, 1])};
            }
            return null;
          }
        }),
        utcOffsetSeconds: () => 3600
      } as unknown as WeatherApiResponse;

      expect(() => processDailyWeather(mockResponse))
        .toThrow(IncompleteDataError);
    });

    it('should throw IncompleteDataError if tempMinValues is missing', () => {
      const mockResponse = {
        daily: () => ({
          time: () => '1722596400',
          timeEnd: () => '1722769200',
          interval: () => 86400,
          variables: (index: number) => {
            if (index === 0 || index === 1) {
              return {valuesArray: () => new Float32Array([0, 1])};
            }
            return null;
          }
        }),
        utcOffsetSeconds: () => 3600
      } as unknown as WeatherApiResponse;

      expect(() => processDailyWeather(mockResponse))
        .toThrow(IncompleteDataError);
    });
  });
});
