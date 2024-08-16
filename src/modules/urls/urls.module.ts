import { Module } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';

@Module({
  controllers: [UrlsController],
  providers: [UrlsService, PrismaClient],
  exports: [UrlsService],
})
export class UrlsModule {}
