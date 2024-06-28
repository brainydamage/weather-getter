export interface WeatherParams {
  latitude: number;
  longitude: number;
  current: string;
  daily: string;
  timezone: string;
}

export interface CurrentWeatherData {
  time: string;
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
}

export interface DailyWeatherData {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
}

export interface WeatherApiParams {
  latitude: number;
  longitude: number;
  current: string;
  daily: string;
  timezone: string;
}
