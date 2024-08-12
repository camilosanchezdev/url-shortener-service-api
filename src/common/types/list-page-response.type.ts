export type ListPageResponse<T = any> = {
  count: number;
  start: number;
  length: number;
  data: T[];
};
