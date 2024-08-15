import { Injectable } from '@nestjs/common';
import { BaseCrudService } from '../../common/services/base-crud.service';
import { Prisma, PrismaClient, Url } from '@prisma/client';
import { UrlDto } from './dtos/url.dto';
import generateShortCode from '../../common/utils/generate-short-code.util';
import { BaseResponseType } from '../../common/types/generic-response.type';

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
  async updateByCustomer(
    id: number,
    payload: UrlDto,
    customerId: number,
  ): Promise<Url> {
    try {
      const url = await this.findOne(id, { user: { id: customerId } });
      if (!url) this.withoutRecordsError();

      return await this.update<UrlDto>(url.id, payload);
    } catch (e) {
      throw e;
    }
  }
  async removeByCustomer(
    id: number,
    customerId: number,
  ): Promise<BaseResponseType> {
    try {
      const url = await this.findOne(id, { user: { id: customerId } });
      if (!url) this.withoutRecordsError();
      return await this.remove(url.id);
    } catch (e) {
      throw e;
    }
  }
  async findOneByShortCode(shortCode: string): Promise<{ url: string }> {
    try {
      const response = await this.findOne(null, { shortCode, deleted: false });
      if (!response) this.withoutRecordsError();

      // Add click
      await this.update(response.id, {
        clicks: response.clicks + 1,
      });

      const { originalUrl: url } = response;
      return { url };
    } catch (e) {
      throw e;
    }
  }
}
