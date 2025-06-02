import * as express from 'express';
import * as pdf from 'html-pdf';
import Chance from 'chance';
const chance = new Chance();
import * as _ from 'lodash';

export class HtmlToPdfUtil {
  static readonly A4 = {
    format: 'A4',
    paginationOffset: 1,
    header: {
      height: '10px',
      contents: '',
    },
    footer: {
      height: '10px',
      contents: {
        default: ``,
      },
    },
    border: {
      top: '10px',
      right: '40px',
      bottom: '50px',
      left: '40px',
    },
    childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' } },
  };

  static readonly A4_LANDSCAPE = {
    format: 'A4',
    orientation: 'landscape',
    paginationOffset: 1,
    header: {
      height: '10px',
      contents: '',
    },
    footer: {
      height: '10px',
      contents: {
        default: ``,
      },
    },
    border: {
      top: '10px',
      right: '5px',
      bottom: '40px',
      left: '5px',
    },
    childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' } },
  };

  static readonly A5_LANDSCAPE = {
    format: 'A5',
    orientation: 'landscape',
    paginationOffset: 1,
    header: {
      height: '0',
      contents: '',
    },
    footer: {
      height: '0',
      contents: {
        default: ``,
      },
    },
    border: {
      top: '10px',
      right: '10px',
      bottom: '10px',
      left: '10px',
    },
    childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' } },
  };

  public static htmlToPdf(html, config) {
    const pdfOptions = config ?? HtmlToPdfUtil.A4;
    return new Promise((resolve, reject) => {
      pdf.create(html, pdfOptions).toBuffer((err, buffer) => {
        if (err) {
          return resolve('');
        }
        if (!buffer) {
          return resolve('');
        }
        return resolve(buffer.toString('base64'));
      });
    });
  }

  public static htmlToPdfAndSave(
    html: string,
    config: any,
    outputPath: string,
  ) {
    const pdfOptions = config ?? HtmlToPdfUtil.A4;

    return new Promise((resolve, reject) => {
      pdf.create(html, pdfOptions).toFile(outputPath, (err, res) => {
        if (err) {
          console.error('Error creating PDF:', err);
          return reject(err);
        }
        if (!res) {
          console.log(err);
          return reject(new Error('Failed to generate PDF file.'));
        }
        console.log('PDF saved at:', res.filename);
        resolve(res.filename); // Trả về đường dẫn file đã lưu
      });
    });
  }
}
