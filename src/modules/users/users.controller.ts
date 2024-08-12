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

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getList(@Query() criteria: ListPageCriteriaDto): Promise<ListPageResponse<User>> {
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
  update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateUserDto): Promise<User> {
    return this.usersService.update<UpdateUserDto>(id, payload, ['password']);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<BaseResponseType> {
    return this.usersService.remove(id);
  }
  @Put('change-password/:id')
  changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: ChangePasswordDto,
  ): Promise<User> {
    return this.usersService.changePassword(id, payload);
  }
}
