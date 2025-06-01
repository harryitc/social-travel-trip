/**
 * View document detail in readme.md file ^^
 */
export interface ICustomFilterQuery {
  id: string;
  value: string;
}

export interface ILimitOffset {
  limit: number;
  offset: number;
}
export interface ISortingData {
  [columnName: string]: ('ASC' | 'DESC') | any;
}

export class CustomQueryHelper {
  public static extractPageSize(page: number, perPage: number): ILimitOffset {
    const MAX_LIMIT = 200;
    const MIN_LIMIT = 10;

    let limit = Math.min(perPage, MAX_LIMIT);
    limit = Math.max(limit, MIN_LIMIT);

    let offset = 0;
    if (page > 1) {
      offset = (page - 1) * limit;
    }
    return { limit: limit, offset: offset };
  }

  // Convert [{id: "search", value: "example"}] => {search: "example"}
  public static extractFilter(filters: any) {
    const obj = {};
    filters?.forEach((item: any) => {
      obj[item.id] = item.value;
    });
    return obj;
  }

  // Input: ['name:asc'] => { 'name': 'ASC' }
  public static extractSort(sorts: string[]): ISortingData {
    if (!sorts || sorts.length === 0) {
      return {};
    }

    const sortsMap: ISortingData = {};

    sorts.forEach((sortItem) => {
      const [field, type] = sortItem.split(':');
      let order: 'DESC' | 'ASC' | string = 'DESC';

      if (type && type.trim().toUpperCase() === 'ASC') {
        order = 'ASC';
      }

      sortsMap[field.trim()] = order;
    });

    return sortsMap;
  }

  // Chuyển dổi data trả về khi query của ORM thành kiểu ConnectionPool
  public static toQueryAndCountResult(arrs: [any[], any]): Array<any> {
    const result: any = {
      command: '',
      fields: [],
      oid: 0,
      rowCount: arrs[0].length,
      rows: arrs[0],
    };

    const count: any = {
      command: '',
      fields: [],
      oid: 0,
      rowCount: arrs[0].length,
      rows: [{ count: arrs[1] }],
    };
    return [result, count];
  }
}
