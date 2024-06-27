// test/api/openMeteoService.test.ts
import {fetchWeatherData} from './openMeteoService';
import {DataNotAvailableError} from '../errors/appErrors';
import * as openmeteo from 'openmeteo';

jest.mock('openmeteo', () => ({
  fetchWeatherApi: jest.fn()
}));

describe('fetchWeatherData', () => {
  it('should return weather data successfully', async () => {
    const mockResponse = [{current: {}, daily: {}}];
    (openmeteo.fetchWeatherApi as jest.Mock).mockResolvedValue(mockResponse);

    const result = await fetchWeatherData('test-url',
      {latitude: 0, longitude: 0, current: '', daily: '', timezone: ''});

    expect(result).toEqual(mockResponse[0]);
  });

  it('should throw DataNotAvailableError if no data is returned', async () => {
    (openmeteo.fetchWeatherApi as jest.Mock).mockResolvedValue([]);

    await expect(fetchWeatherData('test-url',
      {latitude: 0, longitude: 0, current: '', daily: '', timezone: ''}))
      .rejects
      .toThrow(DataNotAvailableError);
  });
});
