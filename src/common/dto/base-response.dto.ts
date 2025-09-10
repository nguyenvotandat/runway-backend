export class BaseResponseDto<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];

  constructor(success: boolean, message: string, data?: T, errors?: string[]) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }

  static success<T>(data: T, message = 'Success'): BaseResponseDto<T> {
    return new BaseResponseDto(true, message, data);
  }

  static error(message: string, errors?: string[]): BaseResponseDto<null> {
    return new BaseResponseDto(false, message, null, errors);
  }
}
