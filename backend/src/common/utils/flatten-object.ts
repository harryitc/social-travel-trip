export type FlattenObject<T> = T extends object
  ? T extends Array<any>
    ? T[number]
    : T extends { [key: string]: any }
      ? { [K in keyof T]: FlattenObject<T[K]> }
      : T
  : T;

export function flattenObject<T extends object>(obj: T): FlattenObject<T> {
  const flattened: any = {};

  function flatten(obj: any, prefix = '') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const propName = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          flatten(obj[key], propName);
        } else {
          flattened[propName] = obj[key];
        }
      }
    }
  }

  flatten(obj);
  return flattened as FlattenObject<T>;
}
