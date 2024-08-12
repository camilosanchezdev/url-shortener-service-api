import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseCrudService } from '../../common/services/base-crud.service';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { UserDto } from './dtos/user.dto';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordDto } from './dtos/change-password.dto';

@Injectable()
export class UsersService extends BaseCrudService<User, Prisma.UserWhereInput> {
  constructor(private readonly prisma: PrismaClient) {
    super(prisma, 'User');
  }
  async createCustom(data: UserDto): Promise<User> {
    const existingUser = await this.findOne(null, { email: data.email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const payload: UserDto = { ...data, password: hashedPassword };
    return this.create<UserDto>(payload, ['password']);
  }
  // async changePassword(id: number, data: ChangePasswordDto): Promise<User> {
  //   const user = await this.findOne(id);
  //   const isMatch = await bcrypt.compare(data.oldPassword, user.password);
  //   if (!isMatch) {
  //     throw new BadRequestException('Invalid old password');
  //   }
  //   const hashedPassword = await bcrypt.hash(data.newPassword, 12);
  //   const payload: UserDto = { ...user, password: hashedPassword };
  //   return this.update<UserDto>(id, payload, ['password']);
  // }
  async changePassword(id: number, data: ChangePasswordDto): Promise<User> {
    const user = await this.findOne(id);
    const hashedPassword = await bcrypt.hash(data.newPassword, 12);
    const payload: UserDto = { ...user, password: hashedPassword };
    return this.update<UserDto>(id, payload, ['password']);
  }
}
