import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({ example: 'email@gmail.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  roleId: number;
}
