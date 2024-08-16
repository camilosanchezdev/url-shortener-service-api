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
import { Prisma, User } from '@prisma/client';
import { UsersService } from './users.service';
import { ListPageResponse } from '../../common/types/list-page-response.type';
import { ApiTags } from '@nestjs/swagger';
import { ListPageCriteriaDto } from '../../common/dtos/list-page-criteria.dto';
import { UserDto } from './dtos/user.dto';
import { BaseResponseType } from '../../common/types/generic-response.type';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { RolesEnum } from '../../common/enums/roles.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TokenType } from '../auth/types/token.type';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(RolesEnum.CUSTOMER)
  @Put('change-password')
  changePassword(
    @Body() payload: ChangePasswordDto,
    @CurrentUser() customer: TokenType,
  ): Promise<BaseResponseType> {
    const customerId = customer.sub;
    return this.usersService.changePassword(customerId, payload);
  }

  @Get()
  getList(
    @Query() criteria: ListPageCriteriaDto,
  ): Promise<ListPageResponse<User>> {
    return this.usersService.list<Prisma.UserWhereInput>(
      criteria,
      { deleted: false },
      ['password'],
      {
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    );
  }
  @Post()
  create(@Body() payload: UserDto): Promise<User> {
    return this.usersService.createCustom(payload);
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id, null, ['password']);
  }
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update<UpdateUserDto>(id, payload, ['password']);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<BaseResponseType> {
    return this.usersService.remove(id);
  }
}
