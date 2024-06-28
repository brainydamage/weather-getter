import { fetchWeatherData } from './openMeteoService';
import { DataNotAvailableError } from '../errors/appErrors';
import * as openmeteo from 'openmeteo';

jest.mock('openmeteo', () => ({
  fetchWeatherApi: jest.fn(),
}));

describe('fetchWeatherData', () => {
  const url = 'test-url';
  const params = {
    latitude: 0,
    longitude: 0,
    current: '',
    daily: '',
    timezone: '',
  };

  describe('Success scenarios', () => {
    it('should return weather data successfully', async () => {
      const mockResponse = [{ current: {}, daily: {} }];
      (openmeteo.fetchWeatherApi as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchWeatherData(url, params);

      expect(result).toEqual(mockResponse[0]);
    });
  });

  describe('Error scenarios', () => {
    it('should throw DataNotAvailableError if no data is returned', async () => {
      (openmeteo.fetchWeatherApi as jest.Mock).mockResolvedValue([]);

      await expect(fetchWeatherData(url, params)).rejects.toThrow(
        DataNotAvailableError,
      );
    });
  });
});
