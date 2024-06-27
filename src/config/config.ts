export const config = {
  awsRegion: 'eu-central-1',
  bucketName: 'weather-data-files',
  apiUrl: 'https://api.open-meteo.com/v1/forecast',
  contentType: 'application/json',
  dailyPrefix: 'daily-weather',
  currentPrefix: 'current-weather',
  latitude: 44.804,
  longitude: 20.4651,
  currentParams: 'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m',
  dailyParams: 'weather_code,temperature_2m_max,temperature_2m_min',
  timezone: 'Europe/Berlin',
};