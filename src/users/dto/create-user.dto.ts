import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsPhoneNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(5, 50)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @Transform(({ value }: { value: string }) => value.replace(/\s+/g, ''))
  @IsPhoneNumber('VN')
  readonly phone: string;

  @Type(() => Number)
  @IsInt()
  @Min(18, { message: 'Age must be at least 18' })
  @Max(65, { message: 'Age must be at most 65' })
  readonly age: number;
}
