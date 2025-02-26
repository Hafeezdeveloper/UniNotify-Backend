import {IsBoolean, IsNumber, IsOptional, IsPositive} from 'class-validator';
import {Transform, Type} from 'class-transformer';
import {ApiPropertyOptional} from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number) // ensures the parameter is treated as a number
  @IsPositive() // ensures the number is positive
  readonly page?: number;

  @ApiPropertyOptional({
    description: 'Limit of items per page for pagination',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number) // ensures the parameter is treated as a number
  @IsPositive() // ensures the number is positive
  readonly limit?: number;
}
export class OptionalDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Optional parameter to redirect to another service',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({value}) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  readonly options?: boolean;
}

export const PaginatedOutput = {
  currentPage: 1,
  totalPages: 1,
  limit: 10,
  totalItems: 2,
};
