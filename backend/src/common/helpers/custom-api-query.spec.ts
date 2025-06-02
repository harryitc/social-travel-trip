import { CustomQueryHelper } from './custom-api-query';

describe('CustomQueryHelper', () => {
  describe('extractPageSize', () => {
    it('should return limit and offset based on page and perPage', () => {
      const page = 2;
      const perPage = 20;
      const result = CustomQueryHelper.extractPageSize(page, perPage);
      expect(result.limit).toBe(perPage);
      expect(result.offset).toBe((page - 1) * perPage);
    });

    it('should limit perPage to MAX_LIMIT', () => {
      const page = 4;
      const perPage = 300;
      const result = CustomQueryHelper.extractPageSize(page, perPage);
      expect(result.limit).toBe(200);
      expect(result.offset).toBe((4 - 1) * 200);
    });

    it('should set default perPage if not provided', () => {
      const page = 1;
      const result = CustomQueryHelper.extractPageSize(page, null);
      expect(result.limit).toBe(10);
      expect(result.offset).toBe(0);
    });
  });

  describe('extractFilter', () => {
    it('should convert array of filter objects to key-value pairs', () => {
      const filters = [{ id: 'search', value: 'example' }];
      const result = CustomQueryHelper.extractFilter(filters);
      expect(result).toEqual({ search: 'example' });
    });

    it('should return empty object if filters array is empty', () => {
      const filters = [];
      const result = CustomQueryHelper.extractFilter(filters);
      expect(result).toEqual({});
    });

    it('should handle undefined filters array', () => {
      const result = CustomQueryHelper.extractFilter(undefined);
      expect(result).toEqual({});
    });
  });

  describe('extractSort', () => {
    it('should convert array of sort strings to ISortingData object', () => {
      const sorts = ['name:asc', 'age:desc'];
      const result = CustomQueryHelper.extractSort(sorts);
      expect(result).toEqual({ name: 'ASC', age: 'DESC' });
    });

    it('should handle empty array of sort strings', () => {
      const sorts: string[] = [];
      const result = CustomQueryHelper.extractSort(sorts);
      expect(result).toEqual({});
    });

    it('should handle undefined sorts array', () => {
      const result = CustomQueryHelper.extractSort(undefined);
      expect(result).toEqual({});
    });
  });

  describe('toQueryAndCountResult', () => {
    it('should return an array with query result and count result', () => {
      const queryResult = [[{ id: 1 }, { id: 2 }], 2];
      const [result, count] = CustomQueryHelper.toQueryAndCountResult(
        queryResult as any,
      );
      expect(result.rowCount).toBe(queryResult[1]);
      expect(result.rows).toEqual(queryResult[0]);
      expect(count.rows).toEqual([{ count: 2 }]);
    });
  });
});
