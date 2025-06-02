// eslint-disable-next-line @typescript-eslint/no-var-requires
const Moment = require('moment');
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);
export enum DayOfWeekEnum {
  THU_2 = 1,
  THU_3 = 2,
  THU_4 = 3,
  THU_5 = 4,
  THU_6 = 5,
  THU_7 = 6,
  CHU_NHAT = 7,
}

export enum MonthEnum {
  THANG_1 = 1,
  THANG_2 = 2,
  THANG_3 = 3,
  THANG_4 = 4,
  THANG_5 = 5,
  THANG_6 = 6,
  THANG_7 = 7,
  THANG_8 = 8,
  THANG_9 = 9,
  THANG_10 = 10,
  THANG_11 = 11,
  THANG_12 = 12,
}

export interface IDateRange {
  from_date: string;
  to_date: string;
}

export class DATE {
  static formatDate = 'YYYY-MM-DD';
  static formatFull = 'YYYY-MM-DD HH:mm:ss';
  static formatAfter = 'DD/MM/YYYY HH:mm:ss';
  static formatAfter2 = 'DD/MM/YYYY HH:mm';
  static formatDDMMYYYY = 'DD/MM/YYYY';
  static formatYYYYMMDDHHmm = 'YYYY-MM-DD HH:mm';
  static formatId = 'DDMMYYYYHHmmssSSS';
  static formatSms = 'YYYYMMDDHHmmss';

  static formatHalfTime = 'HH:mm';
  static formatHalfTime2 = 'HH[h]mm';
  static formatTime = 'HH:mm:ss';
  static formatDDMMYYYYHH_lien = 'DDMMYYYYHH';
  static formatTimeSyn = 'HH:mm:ss dddd, DD MMMM YYYY';

  static nowByLocal(date, lang) {
    return moment(date)
      .locale(lang || 'vi')
      .fromNow();
  }
  static now() {
    return moment();
  }

  static date(date) {
    return moment(date);
  }

  static range(from_date, to_date, format) {
    return moment.range(moment(from_date, format), moment(to_date, format));
  }

  static getDayOfWeekName(dow: number): { dow: number; text: string } {
    switch (dow) {
      case DayOfWeekEnum.CHU_NHAT:
        return {
          dow: dow,
          text: 'Chủ nhật',
        };
      case DayOfWeekEnum.THU_2:
      case DayOfWeekEnum.THU_3:
      case DayOfWeekEnum.THU_4:
      case DayOfWeekEnum.THU_5:
      case DayOfWeekEnum.THU_6:
      case DayOfWeekEnum.THU_7:
        return {
          dow: dow,
          text: 'Thứ ' + (+dow + 1),
        };
      default:
        return {
          dow: 0,
          text: '',
        };
    }
  }

  static getMonthRange(month: MonthEnum) {
    return moment.range(
      moment().month(this.momentMonth(month)).startOf('month'),
      moment().month(this.momentMonth(month)).endOf('month'),
    );
  }

  static dayOfWeek(date, format): { dow: number; text: string } {
    const dow = moment(date, format).isoWeekday();
    return this.getDayOfWeekName(dow);
  }

  static momentMonth(value: MonthEnum) {
    switch (+value) {
      case MonthEnum.THANG_1:
        return 0;

      case MonthEnum.THANG_2:
        return 1;

      case MonthEnum.THANG_3:
        return 2;

      case MonthEnum.THANG_4:
        return 3;

      case MonthEnum.THANG_5:
        return 4;

      case MonthEnum.THANG_6:
        return 5;

      case MonthEnum.THANG_7:
        return 6;

      case MonthEnum.THANG_8:
        return 7;

      case MonthEnum.THANG_9:
        return 8;

      case MonthEnum.THANG_10:
        return 9;

      case MonthEnum.THANG_11:
        return 10;

      case MonthEnum.THANG_12:
        return 11;

      default:
        break;
    }
  }

  static add(amount, unit, format) {
    return moment().add(amount, unit).format(format);
  }

  static formatDatabaseDateTime(date) {
    if (date) {
      return moment(date).format(this.formatFull);
    }
    return '';
  }

  static formatDateTime(date) {
    if (date) {
      return moment(date, this.formatFull).format(this.formatAfter);
    }
    return '';
  }

  static formatDateTime2(date) {
    if (date) {
      return moment(date, this.formatFull).format(this.formatAfter2);
    }
    return '';
  }

  static formatCustom(date, formatDate, format) {
    if (date) {
      return moment(date, formatDate).format(format);
    }
    return '';
  }

  static formatCustomLang(date, formatDate, format, lang) {
    if (date) {
      return moment(date, formatDate).locale(lang).format(format);
    }
    return '';
  }

  static duration(date1, date2, format, type = 'miliseconds') {
    if (!date1 || !date2) {
      return 0;
    }
    date1 = moment(date1, format);
    date2 = moment(date2, format);
    return Math.abs(date1.diff(date2, type));
  }

  static isBefore(date1, date2) {
    if (date1 && date2) {
      return moment(date1, this.formatFull).isBefore(
        moment(date2, this.formatFull),
      );
    }
    return false;
  }

  static isOverlap(startDate1, endDate1, startDate2, endDate2) {
    const range1 = moment.range(
      moment(startDate1, this.formatFull),
      moment(endDate1, this.formatFull),
    );
    const range2 = moment.range(
      moment(startDate2, this.formatFull),
      moment(endDate2, this.formatFull),
    );
    return range1.overlaps(range2);
  }
}
