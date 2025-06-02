import fs from 'fs';
import path from 'path';
import { render } from 'mustache';
import _ from 'lodash';

export class AssetsProvider {
  private basePath: string;

  constructor(basePath: string[]) {
    if (basePath.length > 0) {
      this.setBasePath(basePath);
    }
  }

  // don't forget add __dirname if u want exec to 'dist' folder.
  setBasePath = (basePath: string[]) => {
    this.basePath = path.join(...basePath);
    console.log(this.basePath)
  };

  public getSqlFile(fileName: string) {
    return fs
      .readFileSync(path.join(this.basePath, 'sql', fileName))
      .toString();
  }

  public getSqlFileAsync(fileName: string, templateOptions?: any) {
    return new Promise<string>((res, rej) => {
      fs.readFile(path.join(this.basePath, 'sql', fileName), (error, data) => {
        if (error) {
          return rej(error);
        }

        if (templateOptions) {
          return res(
            render(
              data.toString('utf8'),
              _.isEmpty(templateOptions) ? { default: true } : templateOptions,
            ),
          );
        }

        return res(data.toString('utf8'));
      });
    });
  }

  public getTextFile(fileName: string) {
    return fs
      .readFileSync(path.join(this.basePath, 'text', fileName))
      .toString();
  }

  public getHtmlFile(fileName: string) {
    return fs
      .readFileSync(path.join(this.basePath, 'html', fileName))
      .toString();
  }

  public getJsonFile(fileName: string) {
    return fs
      .readFileSync(path.join(this.basePath, 'json', fileName))
      .toString();
  }

  public getJsonFileAsync(fileName: string) {
    return new Promise<any>((res, rej) => {
      fs.readFile(path.join(this.basePath, 'json', fileName), (error, data) => {
        if (error) {
          return rej(error);
        }

        return res(JSON.parse(data.toString('utf8')));
      });
    });
  }

  public getTranslateFile(fileName: string) {
    return fs
      .readFileSync(path.join(this.basePath, 'translate', fileName))
      .toString();
  }

  public getExcelUrlFile(filename: string) {
    return path.join(this.basePath, 'excel', filename);
  }
}
