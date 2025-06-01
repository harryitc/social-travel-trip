import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as _ from 'lodash';
import fs from 'fs';
import path from 'path';
var rimraf = require('rimraf');

@Injectable()
export class DeteleFileDownload {
  constructor() {}

  private readonly logger = new Logger(DeteleFileDownload.name);

  // At 01:00 AM, only on Monday
  @Cron('0 01 * * *')
  // @Cron("*/5 * * * * *")
  async handleCron() {
    try {
      this.logger.debug('DeteleFileDownload At 01:00 AM, only on Monday');
      // Xóa thư mục "files"
      // Thêm lại thư mục "files" mới
      rimraf(path.join(__dirname, '../../../tmp'), function () {
        fs.mkdirSync(path.join(__dirname, '../../../tmp'));
      });
      return;
    } catch (error) {
      return;
    }
  }
}
