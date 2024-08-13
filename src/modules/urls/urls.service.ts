import { Injectable } from '@nestjs/common';
import { BaseCrudService } from '../../common/services/base-crud.service';
import { Prisma, PrismaClient, Url } from '@prisma/client';
import { UrlDto } from './dtos/url.dto';
import generateShortCode from '../../common/utils/generate-short-code.util';

@Injectable()
export class UrlsService extends BaseCrudService<Url, Prisma.UrlWhereInput> {
  constructor(private readonly prisma: PrismaClient) {
    super(prisma, 'Url');
  }
  async createCustom(
    { originalUrl, title }: UrlDto,
    customerId: number,
  ): Promise<Url> {
    const shortCode = generateShortCode();
    const payload = {
      originalUrl,
      title,
      shortCode,
      user: { connect: { id: customerId } },
    };
    return this.create(payload);
  }
}
