import { QueryCriteria } from '../../common/types/query-criteria.type';

export function queryBuilderCriteria<T>(
  criteria: QueryCriteria,
  searchProperties?: Array<string>,
): T | {} {
  let queryBuilder: T | {} = {};

  if (criteria?.filters) {
    for (let index = 0; index < criteria.filters.length; index++) {
      const filter = criteria.filters[index];
      const newFilter = {};
      if (filter.type === 'in') {
        newFilter[filter.propertyName] = { in: JSON.parse(filter.value) };
      } else if (filter.type === 'date') {
        const values = JSON.parse(filter.value);

        newFilter[filter.propertyName] = {
          gte: values[0],
          lte: values[1],
        };
      } else {
        newFilter[filter.propertyName] = filter.value;
      }

      queryBuilder = { ...queryBuilder, ...newFilter };
    }
  }
  if (criteria?.search) {
    queryBuilder = {
      ...queryBuilder,
      OR: searchProperties.map(property => ({
        [property]: {
          contains: String(criteria.search),
          mode: 'insensitive',
        },
      })),
    };
  }
  return queryBuilder;
}
