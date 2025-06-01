import _ from 'lodash';

interface QuillReplace {
  regex: RegExp;
  replace_text: string;
}

export class Quill {
  static empty = {
    ops: [
      {
        insert: '\n',
      },
    ],
  };

  static replace(delta: { ops: any[] }, replace: QuillReplace[]) {
    delta.ops.forEach((elem) => {
      replace.forEach((r) => {
        if (typeof elem.insert == 'string') {
          elem.insert = _.replace(elem.insert, r.regex, r.replace_text);
        }
      });
    });
  }
}
