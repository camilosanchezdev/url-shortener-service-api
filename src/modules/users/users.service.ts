import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseCrudService } from '../../common/services/base-crud.service';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { UserDto } from './dtos/user.dto';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { RegisterDto } from '../auth/dtos/register.dto';
import { RolesEnum } from '../../common/enums/roles.enum';

@Injectable()
export class UsersService extends BaseCrudService<User, Prisma.UserWhereInput> {
  constructor(private readonly prisma: PrismaClient) {
    super(prisma, 'User');
  }
  async createCustom(data: UserDto): Promise<User> {
    try {
      const existingUser = await this.findOne(null, { email: data.email });
      if (existingUser) {
        throw new BadRequestException('User already exists');
      }
    } catch (e) {
      if (e instanceof NotFoundException) {
        const hashedPassword = await bcrypt.hash(data.password, 12);
        const payload: UserDto = { ...data, password: hashedPassword };
        return this.create<UserDto>(payload, ['password']);
      }
      throw e;
    }
  }
  async changePassword(id: number, data: ChangePasswordDto): Promise<User> {
    const user = await this.findOne(id);
    const isMatch = await bcrypt.compare(data.oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid old password');
    }
    const hashedPassword = await bcrypt.hash(data.newPassword, 12);
    const payload: UserDto = { ...user, password: hashedPassword };
    return this.update<UserDto>(id, payload, ['password']);
  }

  async register({ email, password, name }: RegisterDto): Promise<User> {
    return this.createCustom({
      email,
      password,
      name,
      roleId: RolesEnum.CUSTOMER,
    });
  }
}
