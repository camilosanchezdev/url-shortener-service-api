export type FilterCriterion = {
  propertyName: string;
  type: string;
  value: any;
  from?: string;
  to?: string;
  or?: FilterCriterion[];
  and?: FilterCriterion[];
};
