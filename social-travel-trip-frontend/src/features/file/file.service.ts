import Http from '@/lib/http';
import { API_ENDPOINT } from '@/config/api.config';

/**
 * Interface for file upload response
 */
export interface FileUploadResponse {
  file_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  created_at: string;
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
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload file
      const response = await Http.post(`${API_ENDPOINT.file_v2}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response;
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
      const uploadPromises = files.map(file => this.uploadFile(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      throw error;
    }
  }
};
