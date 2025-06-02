import { Injectable, Logger } from '@nestjs/common';
@Injectable()
export class FileSagas {
  private readonly logger = new Logger(FileSagas.name);
}
