import {fetchWeatherData} from './api/openMeteoService';
import {S3Manager} from './aws/s3Service';
import {config} from './config/config';
import {
  processCurrentWeather,
  processDailyWeather
} from './weather/weatherProcessing';
import {WeatherApiParams} from './interfaces/interfaces';
import {WeatherApiResponse} from '@openmeteo/sdk/weather-api-response';

const s3Manager = new S3Manager(config.awsRegion, config.bucketName);

function getWeatherApiParams(): WeatherApiParams {
  return {
    latitude: config.latitude,
    longitude: config.longitude,
    current: config.currentParams,
    daily: config.dailyParams,
    timezone: config.timezone,
  };
}

async function handleWeatherData(weatherData: WeatherApiResponse) {
  const currentWeatherData = processCurrentWeather(weatherData);
  const dailyWeatherData = processDailyWeather(weatherData);
  await s3Manager.uploadDataToS3(currentWeatherData);
  await s3Manager.uploadDataToS3(dailyWeatherData);
}

export const handler = async () => {
  try {
    const weatherData = await fetchWeatherData(config.apiUrl,
      getWeatherApiParams());
    await handleWeatherData(weatherData);

    return {
      statusCode: 200,
      body: JSON.stringify('Weather data uploaded successfully.')
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({error: 'Failed to fetch weather data'})
    };
  }
};
