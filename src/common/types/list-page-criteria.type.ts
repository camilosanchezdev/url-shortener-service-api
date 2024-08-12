import { QueryCriteria } from './query-criteria.type';

export type ListPageCriteria = {
  start: number;
  length: number;
  query?: string;
  criteria?: QueryCriteria;
};
