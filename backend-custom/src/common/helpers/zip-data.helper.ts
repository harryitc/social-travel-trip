import * as fs from 'fs';
import archiver from 'archiver';

export class ZipDataHelper {
  // Hàm để nén folder hoặc file
  public static async zipFolderAndFiles(
    folderPath: string,
    zipFilePath: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      // Tạo stream để ghi file .zip
      const output = fs.createWriteStream(zipFilePath);

      // Khởi tạo archiver
      const archive = archiver('zip', {
        zlib: { level: 9 }, // Tỉ lệ nén
      });

      // Lỗi khi ghi file zip
      archive.on('error', (err) => reject(err));
      output.on('close', () => resolve(zipFilePath));

      // Gắn output stream cho archiver
      archive.pipe(output);

      // Thêm thư mục vào file zip
      archive.directory(folderPath, false); // `false` để không bao gồm toàn bộ đường dẫn gốc

      // Hoàn thành quá trình ghi
      archive.finalize();
    });
  }
}
