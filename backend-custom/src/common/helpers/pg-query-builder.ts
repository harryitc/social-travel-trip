import { ISortingData } from './custom-api-query';

/**
 * View document detail in readme.md file ^^
 */
export class CustomQueryBuilder {
  public static toOrder(sorts: ISortingData): string {
    const orderClauses: string[] = [];

    for (const key in sorts) {
      if (sorts.hasOwnProperty(key)) {
        const direction = sorts[key];
        if (direction === 'ASC' || direction === 'DESC') {
          orderClauses.push(`${key} ${direction}`);
        } else {
          throw new Error(
            'Wrong direction - direction must be contain ASC or DESC',
          );
        }
      }
    }

    return orderClauses.length > 0
      ? ` ORDER BY ${orderClauses.join(', ')}`
      : '';
  }

  public static toLimitOffset(args: { limit: number; offset: number }): string {
    if (isNaN(args.limit) || isNaN(args.offset)) {
      throw new Error('Limit and offset must be numbers');
    }
    return ` LIMIT ${args.limit} OFFSET ${args.offset} `;
  }
}
