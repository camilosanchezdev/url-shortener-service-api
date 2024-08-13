import { PrismaClient, Prisma } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ListPageResponse } from '../types/list-page-response.type';
import { QueryCriteria } from '../types/query-criteria.type';
import stringToJson from '../../common/utils/string-to-json.util';
import { queryBuilderCriteria } from '../../common/utils/query-builder-criteria.util';
import { BaseResponseType } from '../types/generic-response.type';
import { handleError } from '../../common/utils/handle-error.util';
import {
  excludePropertiesItem,
  excludePropertiesUtil,
} from '../utils/exclude-properties.util';
import { ListPageCriteriaDto } from '../dtos/list-page-criteria.dto';

@Injectable()
export class BaseCrudService<T extends { id: number }, WhereInput> {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly model: Prisma.ModelName,
  ) {}

  async create<CreateInput>(
    data: CreateInput,
    excludeProperties?: Array<string>,
  ): Promise<T> {
    try {
      let res = await this.prismaClient[this.model].create({ data });
      // .catch(handleError);
      if (excludeProperties) {
        res = excludePropertiesItem(res, excludeProperties);
      }
      return res;
    } catch (error) {
      console.log('error', error);
      handleError(error);
    }
  }

  async findOne(
    id?: number,
    conditions?: WhereInput,
    excludeProperties?: Array<string>,
  ): Promise<T> {
    try {
      let res = await this.prismaClient[this.model]
        .findUnique({ where: { ...(id && { id: id }), ...conditions } })
        .catch(handleError);

      if (excludeProperties) {
        res = excludePropertiesItem(res, excludeProperties);
      }

      return res;
    } catch (error) {
      handleError(error);
    }
  }

  async update<UpdateInput>(
    id: number,
    data: UpdateInput,
    excludeProperties?: Array<string>,
  ): Promise<T> {
    try {
      let res = await this.prismaClient[this.model]
        .update({
          where: { id },
          data,
        })
        .catch(handleError);
      if (excludeProperties) {
        res = excludePropertiesItem(res, excludeProperties);
      }
      return res;
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number): Promise<BaseResponseType> {
    try {
      const payload: { deleted: boolean } = { deleted: true };
      await this.update<{ deleted: boolean }>(id, payload);

      return { success: true };
    } catch (error) {
      handleError(error);
    }
  }
  async list<WhereInput>(
    criteria: ListPageCriteriaDto,
    defaultFilters?: WhereInput,
    excludeProperties?: Array<string>,
    includeProperties?: any,
  ): Promise<ListPageResponse<T>> {
    try {
      const take = Number(criteria.length ?? 0);
      const skip = Number(criteria.start ?? 0);
      let query: QueryCriteria | null = null;
      if (criteria.query) {
        query = stringToJson<QueryCriteria>(criteria.query);
      }
      let conditions: WhereInput;
      if (defaultFilters) conditions = defaultFilters;
      conditions = {
        ...conditions,
        ...(query &&
          queryBuilderCriteria<WhereInput>(query, ['question', 'answer'])),
      };
      const total = await this.prismaClient[this.model].count({
        where: conditions,
      });
      let res = await this.prismaClient[this.model].findMany({
        ...(includeProperties && { include: includeProperties }),
        ...(!(take === 0 && skip === 0) && {
          take,
          skip,
        }),
        where: conditions,
        orderBy: { createdAt: 'desc' },
      });

      if (!res) this.withoutRecordsError();

      if (excludeProperties) {
        res = excludePropertiesUtil(res, excludeProperties);
      }
      return {
        count: total,
        start: skip,
        length: take,
        data: res,
      };
    } catch (error) {
      handleError(error);
    }
  }
  withoutRecordsError(): void {
    throw new NotFoundException();
  }
}
