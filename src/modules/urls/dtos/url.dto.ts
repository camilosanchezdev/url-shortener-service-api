import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UrlDto {
  @ApiProperty({ example: 'Original Url' })
  @IsString()
  @IsNotEmpty()
  originalUrl: string;

  @ApiProperty({ example: 'Some title' })
  @IsString()
  title: string;
}
