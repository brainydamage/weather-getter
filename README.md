# Weather Getter

## Project Description

Weather Getter is an AWS Lambda function that fetches data from the public weather service OpenMeteo via an API and stores it into JSON formatted files in an AWS S3 bucket.

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
