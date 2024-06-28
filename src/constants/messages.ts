export const messages = {
  errors: {
    noWeatherData: 'No weather data returned from the API.',
    noCurrentWeatherData: 'No current weather data available.',
    noDailyWeatherData: 'No daily weather data available.',
    failedFetchWeather: 'Failed to fetch weather data.',
    errorFetchingWeatherData: (error: unknown) => `Error fetching weather data: ${error}`,
    incompleteCurrentData: 'Incomplete current weather data variables.',
    incompleteDailyData: 'Incomplete daily weather data.',
    incompleteDailyDataVariables: (date: string) => `Incomplete daily weather data variables for date: ${date}`,
    failedUploadDataBucket: (bucket: string,
                             key: string) => `Failed to upload data to ${bucket}/${key}`,
    failedUploadData: (error: unknown) => `Failed to upload data to S3: ${error}`,

  },
  success: {
    dataUploaded: (bucket: string,
                   key: string) => `Data successfully uploaded to ${bucket}/${key}`,
    weatherDataUploaded: 'Weather data uploaded successfully.',
  }
};