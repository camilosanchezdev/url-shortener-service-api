import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListPageCriteriaDto {
  @ApiProperty()
  @IsString()
  start: number;

  @ApiProperty()
  @IsString()
  length: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  query?: string;
}
