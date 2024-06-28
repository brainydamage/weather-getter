# Weather Getter

## Project Description

Weather Getter is an AWS Lambda function that fetches current and daily weather data from the public weather service OpenMeteo via an API. 

It retrieves the following information:
- **Current Weather Data**: Includes temperature, weather code, wind speed, and wind direction.
- **Daily Weather Data**: Includes weather code, maximum temperature, and minimum temperature for each of the next seven days starting from today.

The fetched data is then uploaded to an AWS S3 bucket in JSON format. Specifically, the function uploads a total of eight files to the S3 bucket:
- One file containing the current weather data.
- Seven files, each containing the daily weather data for one of the next seven days.

## Technologies Used

- TypeScript
- Jest
- Node AWS-SDK

## Running Tests

### Tests
To run unit tests, use the following command:
```bash
npm run test:unit
```

To run integration tests, use the following command:
```bash
npm run test:integration
```

### Coverage
To generate the unit test coverage report, use the following command:
```bash
npm run coverage:unit
```

To generate the integration test coverage report, use the following command:
```bash
npm run coverage:integration
```
