import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Alex',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(96)
  firstName: string;

  @ApiProperty({
    example: 'Smith',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(96)
  lastName?: string;

  @ApiProperty({
    example: 'alex@mail.io',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(96)
  email: string;

  @ApiProperty({
    example: 'Pa$$$w0rd',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(96)
  // @Matches(/^[a-zA-Z0-9]+$/, { message: 'Minimum 8 characters' })
  password: string;
}
