import * as fs from 'fs';
import WorkbookReader from 'xlsx-stream-reader';
import * as XLSX from 'xlsx';
import { LogicErrorException } from '@common/exceptions';
import * as path from 'path';
import { Transform } from 'stream';

export type TPreviewData = {
  excel_field_name: string;
  preview_data: string[];
};

export type TSheetList = {
  sheet_name: string;
  sheet: any[][];
};

export type ExcelData = {
  headers: string[];
  rows: any[];
};

export class ExcelHelper {
  static async readExcelQuickInfoXLSX(filePath: string): Promise<{
    headers: string[];
    totalRows: number;
    previewData: TPreviewData[];
  }> {
    if (!fs.existsSync(filePath)) {
      throw new Error('File does not exist');
    }

    const workbook = XLSX.readFile(filePath);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const headers: string[] = [];
    const previewData: TPreviewData[] = [];
    const range = XLSX.utils.decode_range(worksheet['!ref']!);
    const firstRow = range.s.r;

    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: firstRow, c: col });
      const cell = worksheet[cellAddress];
      const header = cell ? cell.v : `Column ${col + 1}`;
      headers.push(header);

      const preview: string[] = [];
      for (
        let row = firstRow + 1;
        row <= Math.min(firstRow + 3, range.e.r);
        row++
      ) {
        const previewCellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const previewCell = worksheet[previewCellAddress];
        preview.push(previewCell ? previewCell.v : '');
      }

      previewData.push({ excel_field_name: header, preview_data: preview });
    }

    const totalRows = range.e.r - range.s.r;

    return { headers, totalRows, previewData };
  }

  static async readExcelQuickInfoStream(filePath: string): Promise<{
    headers: string[];
    totalRows: number;
    previewData: TPreviewData[];
  }> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) {
        return reject(new Error('File does not exist'));
      }

      const stream = fs.createReadStream(filePath);

      const workbook = new WorkbookReader();

      let headers: string[] = [];
      let totalRows = 0;
      // let totalRows1 = 0;
      const previewDataMap: Map<number, string[]> = new Map(); // Lưu 3 dòng preview gần nhất
      const maxPreviewRows = 3;
      let stopProcessing = false; // Cờ để ngừng xử lý thêm

      workbook.on('worksheet', async (worksheet: any) => {
        if (Number(worksheet.id) === 1) {
          // Only process the first sheet
          worksheet.on('row', (row: any) => {
            // Dừng đọc khi đã đạt đến số lượng previewRowsCount
            if (stopProcessing) return; // Bỏ qua nếu đã xử lý đủ 3 dòng
            if (Number(row.attributes.r) === 1) {
              // do something with row 1 like save as column names
              headers = row.values.slice(1);
            } else if (!ExcelHelper.checkIsEmptyRow(row.values)) {
              totalRows++;
              // Thêm dữ liệu từng dòng vào previewDataMap
              row.values.slice(1).forEach((value: any, colIndex: number) => {
                if (!previewDataMap.has(colIndex)) {
                  previewDataMap.set(colIndex, []);
                }
                const columnPreview = previewDataMap.get(colIndex)!;
                if (columnPreview.length < maxPreviewRows) {
                  columnPreview.push(value || '');
                }
              });
            }
            if (totalRows === 3) {
              stopProcessing = true; // Đặt cờ ngừng xử lý thêm
              worksheet.emit('end'); // Phát tín hiệu kết thúc
              // stream.destroy(); // Dừng stream ngay lập tức
            }
          });

          worksheet.on('end', () => {
            const previewData: TPreviewData[] = headers.map(
              (header, index) => ({
                excel_field_name: header,
                preview_data: previewDataMap.get(index) || [],
              }),
            );
            resolve({ headers, totalRows, previewData });
          });
          // call process after registering handlers
          worksheet.process();
        }
      });

      workbook.on('error', (err: any) => {
        reject(err);
      });

      stream.pipe(workbook);
      // const limitedStream = stream.pipe(
      //   new Transform({
      //     transform(chunk, encoding, callback) {
      //       if (totalRows1 === 3) {
      //         callback(null, null); // Ngăn không truyền thêm dữ liệu
      //         return; // Đảm bảo không gọi thêm callback
      //       } else {
      //         totalRows1++;
      //         callback(null, chunk);
      //       }
      //     },
      //   }),
      // );

      // limitedStream.pipe(workbook);
    });
  }

  static async readExcel(file_path: string): Promise<ExcelData> {
    try {
      if (!fs.existsSync(file_path)) {
        throw new LogicErrorException(`File ${file_path} does not exist`);
      }

      // Đọc file Excel
      const workbook = await XLSX.readFile(file_path);

      // Lấy sheet đầu tiên
      const firstSheetName = workbook.SheetNames[0];
      const firstSheet = workbook.Sheets[firstSheetName];

      // Chuyển sheet thành JSON data
      const excelData: any[] = await XLSX.utils.sheet_to_json(firstSheet, {
        header: 1,
      });

      // Trích xuất headers từ dòng đầu tiên của file Excel
      const headers = excelData[0] || [];

      // Dữ liệu từng dòng (bỏ dòng đầu tiên là headers)
      const rows = excelData
        .slice(1)
        .filter((row: any) => !ExcelHelper.checkIsEmptyRow(row));

      return {
        headers,
        rows,
      };
    } catch (error) {
      throw new LogicErrorException(error);
    }
  }

  static async readExcelStream(filePath: string): Promise<ExcelData> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) {
        return reject(new Error(`File ${filePath} does not exist`));
      }

      const stream = fs.createReadStream(filePath);
      const workbook = new WorkbookReader();

      let headers: string[] = [];
      const rows: any[] = [];

      workbook.on('worksheet', (worksheet: any) => {
        if (Number(worksheet.id) === 1) {
          // Chỉ xử lý sheet đầu tiên
          worksheet.on('row', (row: any) => {
            if (Number(row.attributes.r) === 1) {
              // Lấy header từ dòng đầu tiên
              headers = row.values.slice(1); // Loại bỏ cột đầu tiên (index = 0)
            } else {
              // Đọc dữ liệu từ các dòng sau
              const rowData = row.values
                .slice(1)
                .map((cell: any) => (cell ? cell : '')); // Loại bỏ cột đầu tiên (index = 0) và xử lý null
              if (!ExcelHelper.checkIsEmptyRow(rowData)) {
                rows.push(rowData);
              }
            }
          });

          worksheet.on('end', () => {
            resolve({ headers, rows });
          });

          worksheet.process();
        }
      });

      workbook.on('error', (err: any) => {
        reject(err);
      });

      stream.pipe(workbook);
    });
  }

  public static getFolderPath(folder_path: string): string {
    const _folder_path = path.join(folder_path);

    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(_folder_path)) {
      fs.mkdirSync(_folder_path, { recursive: true });
    }

    return _folder_path;
  }

  public static async createExcelFile(data: {
    sheet_list: Array<TSheetList>;
    file_path: string;
  }): Promise<void> {
    const { sheet_list, file_path } = data;
    // Tạo workbook và các sheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    // Thêm sheet vào workbook
    sheet_list.forEach((item) => {
      const sheet = XLSX.utils.aoa_to_sheet(item.sheet);
      XLSX.utils.book_append_sheet(workbook, sheet, item.sheet_name);
    });

    // Ghi workbook ra file Excel
    await new Promise<void>((resolve) => {
      XLSX.writeFile(workbook, file_path);
      resolve();
    });
  }

  private static checkIsEmptyRow(row: any[]): boolean {
    if (row.length === 0) return true;
    return row.every((cell: any) => {
      return cell === null || cell === undefined || cell === '';
    });
  }
}
