import { ApiError } from './api.error';

export class UnauthorizedError extends ApiError {
  constructor(message?) {
    super(message);

    this.status = 401;
  }
}
