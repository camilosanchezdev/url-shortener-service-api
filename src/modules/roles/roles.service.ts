import { Injectable } from '@nestjs/common';
import { BaseCrudService } from '../../common/services/base-crud.service';
import { Prisma, PrismaClient, Role } from '@prisma/client';

@Injectable()
export class RolesService extends BaseCrudService<Role, Prisma.RoleWhereInput> {
  constructor(private readonly prisma: PrismaClient) {
    super(prisma, 'Role');
  }
}
