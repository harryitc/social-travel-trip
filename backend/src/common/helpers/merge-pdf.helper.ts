import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Merge nhiều file pdf thành 1 file pdf
 * @param folderPath
 * @param outputFilePath
 */
export async function mergePdfs(
  folderPath: string,
  outputFilePath: string,
): Promise<void> {
  const files = fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith('.pdf'));
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const pdfPath = path.join(folderPath, file);
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  fs.writeFileSync(outputFilePath, mergedPdfBytes);
}
