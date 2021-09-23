export class EmptyPathError extends Error {
  status: number;

  constructor(message = 'Path cannot be empty') {
    super(message);

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
  }
}
