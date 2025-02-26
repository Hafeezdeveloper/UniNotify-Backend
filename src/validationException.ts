import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationException extends HttpException {
  validationErrors: any;

  constructor(validationErrors: ValidationError[]) {
    const formattedErrors = ValidationException.formatErrors(validationErrors);
    const response = {
      success: false,
      message: 'formValidation',
      error: formattedErrors,
    };

    super(response, HttpStatus.UNPROCESSABLE_ENTITY);
    this.validationErrors = formattedErrors;
  }

  private static formatErrors(errors: ValidationError[]) {
    const result: Record<string, string> = {};

    errors.forEach((error) => {
      if (error.constraints) {
        const property = error.property;
        result[property] = Object.values(error.constraints)[0] || ""; // Take the first constraint message
      }
    });

    return result;
  }
}
