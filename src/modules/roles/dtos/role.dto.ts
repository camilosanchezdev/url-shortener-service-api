import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RoleDto {
  @ApiProperty({ example: 'Role Name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
