import { fetchWeatherApi } from 'openmeteo';
import { WeatherApiResponse } from '@openmeteo/sdk/weather-api-response';
import { WeatherParams } from '../interfaces/interfaces';
import { DataNotAvailableError } from '../errors/appErrors';
import { messages } from '../constants/messages';

export async function fetchWeatherData(
  url: string,
  params: WeatherParams,
): Promise<WeatherApiResponse> {
  const responses = await fetchWeatherApi(url, params, 5, 2, 1);
  if (responses.length === 0) {
    throw new DataNotAvailableError(messages.errors.noWeatherData);
  }
  return responses[0];
}
