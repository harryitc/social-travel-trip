/* eslint-disable prefer-const */
import { I18n } from 'i18n';
import _ from 'lodash';
import path from 'path';
import { Quill } from './quill';

/**
 * khai bao trong assets/translate/vi_vn
 * Su dung: Translate.trans(string, params)
 */
export class Translate {
  constructor() {
    const i18n = new I18n({
      locales: ['vi_vn'],
      directory: path.join(
        __dirname,
        '../../../',
        process.env.ASSETS_PATH,
        'translate',
      ),
      objectNotation: true,
    });
    i18n.setLocale('vi_vn');
  }

  static trans(string: any, parameters = {}) {
    return i18n.__(string, parameters);
  }

  static transQuill(string: any, regex = []) {
    let obs: any = _.cloneDeep(i18n.__(string));
    Quill.replace(obs, regex);
    return obs;
  }
}
