export const nest = (
  items,
  key = null,
  link = 'field_parent_key',
  excluded = [],
) =>
  items
    .filter((item) => item[link] === key && !excluded.includes(item.field_key))
    .map((item) => ({ ...item, children: nest(items, item.field_key) }));
