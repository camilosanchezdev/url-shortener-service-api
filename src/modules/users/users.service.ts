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
import { BaseResponseType } from '../../common/types/generic-response.type';
import { UpdateInformationDto } from './dtos/update-information.dto';

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
  async changePassword(
    id: number,
    { newPassword, currentPassword }: ChangePasswordDto,
  ): Promise<BaseResponseType> {
    const user = await this.findOne(id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid current password');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const payload: UserDto = { ...user, password: hashedPassword };
    await this.update<UserDto>(id, payload, ['password']);
    return { success: true };
  }

  async register({ email, password, name }: RegisterDto): Promise<User> {
    return this.createCustom({
      email,
      password,
      name,
      roleId: RolesEnum.CUSTOMER,
    });
  }
  async getInformation(id: number): Promise<{ name: string; email: string }> {
    const { name, email } = await this.findOne(id);
    return { name, email };
  }
  async updateInformation(
    id: number,
    { name, email }: UpdateInformationDto,
  ): Promise<BaseResponseType> {
    try {
      await this.findOne(null, {
        email,
        NOT: { id: { equals: id } },
      });
      return { success: false, error: 'Email already in use' };
    } catch (e) {
      if (e instanceof NotFoundException) {
        await this.update(id, { name, email }, ['password', 'roleId']);
        return { success: true };
      }
      throw e;
    }
  }
}
