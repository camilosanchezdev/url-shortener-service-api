import { FilterCriterion } from './filter-criterion.type';
import { SortCriterion } from './sort-criterion.type';

export type QueryCriteria = {
  sorts: SortCriterion[];
  filters: FilterCriterion[];
  search: string;
};
