import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [RolesController],
  providers: [RolesService, PrismaClient],
})
export class RolesModule {}
