import Http from '@/lib/http';
import { API_ENDPOINT } from '@/config/api.config';

/**
 * Interface for file upload response
 */
export interface FileUploadResponse {
  files: {
    domain: string;
    file_hash: string;
    file_name: string;
    file_url: string;
    server_file_name: string;
  }[];
}

/**
 * Service for handling file uploads
 */
export const fileService = {
  /**
   * Upload a file to the server
   * @param file File to upload
   * @returns Promise with file upload response
   */
async uploadFile(file: File): Promise<FileUploadResponse> {
  try {
    const formData = new FormData();

    // Xác định loại file
    const mimeType = file.type;
    let ext = '';
    let fileCategory = '';

    // Xử lý dựa trên loại MIME
    if (mimeType.startsWith('image/')) {
      ext = mimeType === 'image/jpeg' ? 'jpg' : mimeType.split('/')[1];
      fileCategory = 'image';
      formData.append('resize1', JSON.stringify(3)); // Chỉ dùng resize với ảnh
    } else if (mimeType.startsWith('video/')) {
      ext = mimeType.split('/')[1];
      fileCategory = 'file';
    } else if (mimeType.startsWith('audio/')) {
      ext = mimeType.split('/')[1];
      fileCategory = 'file';
    } else if (mimeType === 'application/pdf') {
      ext = 'pdf';
      fileCategory = 'file';
    } else {
      ext = mimeType.split('/')[1] || 'bin';
      fileCategory = 'file';
    }

    // Gắn dữ liệu vào form
    formData.append('files', file);
    formData.append('type', fileCategory);
    formData.append('ext', ext);

    // Upload file
    const response = await Http.post(`${API_ENDPOINT.file_v2}/upload`, formData);

    return response as any;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
},


  /**
   * Upload multiple files to the server
   * @param files Files to upload
   * @returns Promise with array of file upload responses
   */
  async uploadMultipleFiles(files: File[]): Promise<FileUploadResponse[]> {
    try {
      const uploadPromises = files.map((file) => this.uploadFile(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      throw error;
    }
  },
};
