import { DATE } from '@common/utils/date-time';

export function datetimeTransform({ value }) {
  return DATE.formatDateTime(value);
}
