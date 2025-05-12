import { ISortingData } from './custom-api-query';
import { CustomQueryBuilder } from './pg-query-builder';

describe('CustomQueryBuilder', () => {
  describe('toOrder', () => {
    it('should return empty string when sorts is empty', () => {
      const sorts: ISortingData = {};
      expect(CustomQueryBuilder.toOrder(sorts)).toBe('');
    });

    it('should return ORDER BY clause with valid sorts', () => {
      const sorts: ISortingData = { field1: 'ASC', field2: 'DESC' };
      expect(CustomQueryBuilder.toOrder(sorts)).toBe(
        ' ORDER BY field1 ASC, field2 DESC',
      );
    });

    it('should throw error for invalid direction', () => {
      const sorts: ISortingData = { field1: 'ASC', field2: 'INVALID' };
      expect(() => CustomQueryBuilder.toOrder(sorts)).toThrow(
        'Wrong direction - direction must be contain ASC or DESC',
      );
    });
  });

  describe('toLimitOffset', () => {
    it('should return LIMIT and OFFSET clauses', () => {
      const args = { limit: 10, offset: 20 };
      expect(CustomQueryBuilder.toLimitOffset(args)).toBe(
        ' LIMIT 10 OFFSET 20 ',
      );
    });

    it('should throw error if limit or offset is not a number', () => {
      const args = { limit: 'invalid', offset: 20 };
      expect(() => CustomQueryBuilder.toLimitOffset(args as any)).toThrow(
        'Limit and offset must be numbers',
      );
    });
  });
});
