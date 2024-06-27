import {range} from '../utils/utilities';
import {WeatherApiResponse} from '@openmeteo/sdk/weather-api-response';
import {CurrentWeatherData, DailyWeatherData} from '../interfaces/interfaces';
import {DataNotAvailableError, IncompleteDataError} from '../errors/appErrors';

export function processCurrentWeather(response: WeatherApiResponse): CurrentWeatherData {
  const current = response.current();
  if (!current) {
    throw new DataNotAvailableError('No current weather data available.');
  }

  const temperature = current.variables(0)?.value();
  const weatherCode = current.variables(1)?.value();
  const windSpeed = current.variables(2)?.value();
  const windDirection = current.variables(3)?.value();

  if (!temperature || !weatherCode || !windSpeed || !windDirection) {
    throw new IncompleteDataError(
      'Incomplete current weather data variables');
  }

  const utcOffsetSeconds = response.utcOffsetSeconds();

  return {
    time: new Date(
      (Number(current.time()) + utcOffsetSeconds) * 1000).toISOString(),
    temperature: temperature,
    weatherCode: weatherCode,
    windSpeed: windSpeed,
    windDirection: windDirection,
  };
}

export function processDailyWeather(response: WeatherApiResponse): DailyWeatherData[] {
  const daily = response.daily();
  if (!daily) {
    throw new DataNotAvailableError('No daily weather data available.');
  }

  const utcOffsetSeconds = response.utcOffsetSeconds();
  const times = range(Number(daily.time()), Number(daily.timeEnd()),
    daily.interval())
    .map(t => new Date((t + utcOffsetSeconds) * 1000).toISOString()
    );

  return times.map((date, index) => {
    const weatherValues = daily.variables(0)?.valuesArray();
    const tempMaxValues = daily.variables(1)?.valuesArray();
    const tempMinValues = daily.variables(2)?.valuesArray();

    if (!weatherValues || !tempMaxValues || !tempMinValues) {
      throw new IncompleteDataError(
        `Incomplete daily weather data`);
    }

    for (let i = 0; i < times.length; i++) {
      if (weatherValues[i] == null || tempMaxValues[i] == null ||
        tempMinValues[i] == null) {
        throw new IncompleteDataError(
          `Incomplete daily weather data variables for date: ${times[i]}}`);
      }
    }

    const weatherCode = weatherValues[index];
    const temperatureMax = tempMaxValues[index];
    const temperatureMin = tempMinValues[index];

    return {
      date: date,
      weatherCode: weatherCode,
      temperatureMax: temperatureMax,
      temperatureMin: temperatureMin,
    };
  });
}