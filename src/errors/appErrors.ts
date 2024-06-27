import {AppError} from './baseError';

export class DataNotAvailableError extends AppError {
  constructor(message: string) {
    super(message, 'DataNotAvailableError');
  }
}

export class IncompleteDataError extends AppError {
  constructor(message: string) {
    super(message, 'IncompleteDataError');
  }
}

export class S3UploadError extends AppError {
  constructor(message: string) {
    super(message, 'S3UploadError');
  }
}