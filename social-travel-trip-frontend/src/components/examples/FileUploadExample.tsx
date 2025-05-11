'use client';

import { useState } from 'react';
import { UploadFile, App } from 'antd';
import FileUpload from '../ui/FileUpload';


/**
 * Example component demonstrating how to use the FileUpload component
 */
const FileUploadExample = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const { message } = App.useApp();

  // Handle file list changes
  const handleFileListChange = (newFileList: UploadFile[]) => {
    setFileList(newFileList);
  };

  // Handle upload button click
  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('Vui lòng chọn file trước khi tải lên');
      return;
    }

    try {
      setIsUploading(true);

      // Use the static uploadFiles method with error handling
      const uploadedUrls = await FileUpload.uploadFiles(fileList, {
        onError: (errorMsg) => message.error(errorMsg)
      });

      if (uploadedUrls.length > 0) {
        setUploadedUrl(uploadedUrls[0]);
        message.success('Tải lên thành công!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      message.error('Tải lên thất bại. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Ví dụ tải lên file</h2>

      <div className="mb-6">
        <FileUpload
          fileList={fileList}
          onChange={handleFileListChange}
          maxSize={5}
          maxCount={1}
          buttonText="Chọn File"
          description="Tải lên file của bạn"
          subDescription="Hỗ trợ các định dạng hình ảnh phổ biến. Kích thước tối đa 5MB."
          imageOnly={true}
          previewContainerStyle={{ height: '200px' }}
          previewImageStyle={{ maxHeight: '180px' }}
        />
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={handleUpload}
          disabled={isUploading || fileList.length === 0}
          className={`px-4 py-2 rounded-md ${
            isUploading || fileList.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isUploading ? 'Đang tải lên...' : 'Tải lên'}
        </button>

        {uploadedUrl && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">URL đã tải lên:</h3>
            <div className="p-2 bg-gray-100 rounded break-all">
              {uploadedUrl}
            </div>
            {uploadedUrl.startsWith('http') && (
              <div className="mt-2">
                <img
                  src={uploadedUrl}
                  alt="Uploaded file"
                  className="max-w-full h-auto rounded"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadExample;
