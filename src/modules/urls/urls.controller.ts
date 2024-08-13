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
import { Prisma, Url } from '@prisma/client';
import { BaseResponseType } from '../../common/types/generic-response.type';
import { ApiTags } from '@nestjs/swagger';
import { UrlDto } from './dtos/url.dto';
import { UrlsService } from './urls.service';
import { RoleGuard } from '../auth/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/role.decorator';
import { RolesEnum } from '../../common/enums/roles.enum';
import { TokenType } from '../auth/types/token.type';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('urls')
@ApiTags('Urls')
export class UrlsController {
  constructor(private readonly engineService: UrlsService) {}

  // Admin

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @Get()
  getList(
    @Query() criteria: ListPageCriteriaDto,
  ): Promise<ListPageResponse<Url>> {
    return this.engineService.list<Prisma.RoleWhereInput>(criteria, {
      deleted: false,
    });
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @Post()
  create(@Body() payload: UrlDto): Promise<Url> {
    return this.engineService.create<UrlDto>(payload);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Url> {
    return this.engineService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UrlDto,
  ): Promise<Url> {
    return this.engineService.update<UrlDto>(id, payload);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<BaseResponseType> {
    return this.engineService.remove(id);
  }

  // Customer

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(RolesEnum.CUSTOMER)
  @Post('/customer')
  createByCustomer(
    @Body() payload: UrlDto,
    @CurrentUser() customer: TokenType,
  ): Promise<Url> {
    const customerId = customer.sub;
    return this.engineService.createCustom(payload, customerId);
  }

  // Public
  @Get('/customer/:shortCode')
  getByShortCode(@Param('shortCode') shortCode: string): Promise<Url> {
    return this.engineService.findOne(null, { shortCode });
  }
}
