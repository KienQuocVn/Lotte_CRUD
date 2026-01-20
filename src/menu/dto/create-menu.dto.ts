import { IsString, Length, IsNumber, Min, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMenuDto {
  @IsString()
  @Length(2, 100)
  readonly name: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Price must be at least 0' })
  readonly price: number;

  @IsMongoId()
  readonly category: string;
}
