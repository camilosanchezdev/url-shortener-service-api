import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ListPageCriteriaDto } from '../../common/dtos/list-page-criteria.dto';
import { ListPageResponse } from '../../common/types/list-page-response.type';
import { Prisma, Role } from '@prisma/client';
import { BaseResponseType } from '../../common/types/generic-response.type';
import { ApiTags } from '@nestjs/swagger';
import { RoleDto } from './dtos/role.dto';
import { RolesService } from './roles.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { RolesEnum } from '../../common/enums/roles.enum';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@Roles(RolesEnum.ADMIN)
@Controller('roles')
@ApiTags('Roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @Get()
  getList(
    @Query() criteria: ListPageCriteriaDto,
  ): Promise<ListPageResponse<Role>> {
    return this.rolesService.list<Prisma.RoleWhereInput>(criteria, {
      deleted: false,
    });
  }
  @Post()
  create(@Body() payload: RoleDto): Promise<Role> {
    return this.rolesService.create<RoleDto>(payload);
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.rolesService.findOne(id);
  }
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: RoleDto,
  ): Promise<Role> {
    return this.rolesService.update<RoleDto>(id, payload);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<BaseResponseType> {
    return this.rolesService.remove(id);
  }
}
