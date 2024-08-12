export function excludePropertiesItem<TEntity, Key extends keyof TEntity>(
  entity: TEntity,
  keys: string[],
): Omit<TEntity, Key> {
  return Object.fromEntries(Object.entries(entity).filter(([key]) => !keys.includes(key))) as Omit<
    TEntity,
    Key
  >;
}

export function excludePropertiesUtil<T>(items: Array<T>, excludeProperties: string[]): Array<T> {
  const temp: Array<T> = [];
  items.forEach(item => {
    const el = excludePropertiesItem(item, excludeProperties);
    temp.push(el as T);
  });
  return temp;
}
