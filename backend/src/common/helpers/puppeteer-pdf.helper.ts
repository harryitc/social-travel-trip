import * as fs from 'fs';
import puppeteer, { PaperFormat } from 'puppeteer';

export class PuppeteerPdfHelper {
  /**
   * Dung để tạo file PDF từ HTML bằng thư viện Puppeteer
   * @param htmlContent
   * @param outputFilePath
   * @param isBreakPage
   * @param displayHeaderFooter
   * @param format
   * @param headerTemplate
   * @param footerTemplate
   * @param margin
   */
  static async generatePdf(
    htmlContent: string,
    outputFilePath: string,
    isBreakPage: boolean,
    displayHeaderFooter: boolean = true,
    format: PaperFormat = 'A4',
    headerTemplate: string,
    footerTemplate: string,
    landscape: boolean = false,
    height?: string | number,
    width?: string | number,
  ): Promise<void> {
    const browser = await puppeteer.launch({
      headless: true, // Run in headless mode (no UI)
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--font-config-dir=/usr/share/fonts/',
      ],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      if (isBreakPage) {
        // Áp dụng CSS để chia trang
        await page.addStyleTag({
          content: `
              .page-break { page-break-before: always; }
            `,
        });
      }

      const config: any = new PuppeteerPdfHelper().buildConfig(format);
      Object.assign(config, {
        displayHeaderFooter: displayHeaderFooter,
        headerTemplate: headerTemplate,
        footerTemplate: footerTemplate,
        landscape: landscape,
        height: height,
        width: width,
      });
      const pdfBuffer = await page.pdf(config);

      fs.writeFileSync(outputFilePath, pdfBuffer);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  /**
   * Dùng build config cho file PDF
   * @param format
   * @returns
   */
  buildConfig(format: PaperFormat) {
    switch (format) {
      case 'A4':
        return {
          format: 'A4',
          printBackground: true,
          margin: {
            top: '1cm', // Lề trên
            right: '1.5cm', // Lề phải
            bottom: '1cm', // Lề dưới
            left: '1.5cm', // Lề trái
          },
        };
      default:
        return {};
    }
  }
}
