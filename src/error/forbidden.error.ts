import { ApiError } from './api.error';

export class ForbiddenError extends ApiError {
  constructor(message?) {
    super(message);

    this.status = 403;
  }
}
