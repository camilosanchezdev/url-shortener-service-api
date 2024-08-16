import { Injectable } from '@nestjs/common';
import { BaseCrudService } from '../../common/services/base-crud.service';
import { Prisma, PrismaClient, Url } from '@prisma/client';
import { UrlDto } from './dtos/url.dto';
import generateShortCode from '../../common/utils/generate-short-code.util';
import { BaseResponseType } from '../../common/types/generic-response.type';
import { DashboardResponseInterface } from './interfaces/dashboard-response.interface';

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
  async markAllUrlsAsDeleted(customerId: number): Promise<BaseResponseType> {
    try {
      await this.prisma['url'].updateMany({
        where: { user: { id: customerId }, deleted: false },
        data: { deleted: true },
      });

      return { success: true };
    } catch (e) {
      throw e;
    }
  }
  async dashboard(customerId: number): Promise<DashboardResponseInterface> {
    const conditions = { user: { id: customerId }, deleted: false };
    const res = await this.prisma['url'].aggregate({
      _sum: {
        clicks: true,
      },
      where: conditions,
    });
    const clicks = res._sum.clicks ?? 0;

    return {
      count: await this.prisma['url'].count({
        where: conditions,
      }),
      clicks: clicks,
      urls: await this.prisma['url'].findMany({
        where: conditions,
        orderBy: {
          clicks: 'desc',
        },
        take: 3,
      }),
    };
  }
}
