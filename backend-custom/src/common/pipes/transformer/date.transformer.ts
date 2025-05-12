import { DATE } from '@common/utils/date-time';
import moment from 'moment';

export function dateTransform({ value }) {
  return moment(value).format(DATE.formatDDMMYYYY);
}
