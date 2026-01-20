import {
  IsMongoId,
  IsNumber,
  IsString,
  Min,
  Max,
  Length,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsMongoId()
  readonly user: string;

  @IsMongoId()
  readonly item: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  readonly rating: number;

  @IsString()
  @Length(1, 500)
  readonly comment: string;
}
