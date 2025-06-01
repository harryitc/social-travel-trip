import { useState } from 'react';
import { Upload, UploadProps, UploadFile, Image, App, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uploadFileV2 } from '@/features/file-v2/services/file-v2.service';

const { Text } = Typography;

export type FileType = File;

export interface FileUploadProps {
  /**
   * Current file list
   */
  fileList: UploadFile[];
  /**
   * Callback when file list changes
   */
  onChange: (fileList: UploadFile[]) => void;
  /**
   * Maximum file size in MB
   * @default 2
   */
  maxSize?: number;
  /**
   * Maximum number of files
   * @default 1
   */
  maxCount?: number;
  /**
   * Whether to show the upload list
   * @default false
   */
  showUploadList?: boolean;
  /**
   * Upload button text
   * @default "Tải Lên Hình Ảnh"
   */
  buttonText?: string;
  /**
   * Upload button icon
   * @default <PlusOutlined />
   */
  buttonIcon?: React.ReactNode;
  /**
   * Upload list type
   * @default "picture"
   */
  listType?: UploadProps['listType'];
  /**
   * Accepted file types
   * @default "image/*"
   */
  accept?: string;
  /**
   * Custom validation function
   */
  customValidation?: (file: FileType) => boolean | Promise<boolean>;
  /**
   * Description text
   */
  description?: string;
  /**
   * Secondary description text
   */
  subDescription?: string;
  /**
   * Preview container style
   */
  previewContainerStyle?: React.CSSProperties;
  /**
   * Preview image style
   */
  previewImageStyle?: React.CSSProperties;
  /**
   * Empty state component
   */
  emptyState?: React.ReactNode;
  /**
   * Whether to prevent auto upload
   * @default true
   */
  preventAutoUpload?: boolean;
  /**
   * Upload timeout in milliseconds
   * @default 30000
   */
  uploadTimeout?: number;
  /**
   * Whether to only allow image files
   * @default true
   */
  imageOnly?: boolean;
  /**
   * Custom upload function
   */
  customUpload?: (file: FileType) => Promise<any>;
}

/**
 * Reusable file upload component with preview, validation, and error handling
 */
const FileUpload = ({
  fileList,
  onChange,
  maxSize = 2,
  maxCount = 1,
  showUploadList = false,
  buttonText = 'Tải Lên Hình Ảnh',
  buttonIcon = <PlusOutlined />,
  listType = 'picture',
  accept = 'image/*',
  customValidation,
  description,
  subDescription,
  previewContainerStyle,
  previewImageStyle,
  emptyState,
  preventAutoUpload = true,
  imageOnly = true,
}: FileUploadProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('/assets/image/img/empty-image.png');
  const [previewTitle, setPreviewTitle] = useState('');

  const { message } = App.useApp();

  // Convert file to base64 for preview
  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // Handle file preview
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  // Handle file change
  const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList, file }) => {
    // Nếu file bị loại bỏ bởi beforeUpload, không cập nhật fileList
    if (file.status === 'error' && file.error?.name === 'validation-error') {
      return;
    }

    // Keep only the latest files up to maxCount
    const latestFiles = newFileList.slice(-maxCount);

    // Nếu file mới được thêm vào và là hình ảnh, tạo preview ngay lập tức
    if (file.originFileObj && file.type?.startsWith('image/')) {
      // Tạo preview bằng getBase64 ngay lập tức
      try {
        const previewUrl = await getBase64(file.originFileObj as FileType);

        // Cập nhật file với preview
        const updatedFiles = latestFiles.map((item) => {
          if (item.uid === file.uid) {
            return { ...item, preview: previewUrl };
          }
          return item;
        });

        // Cập nhật danh sách file với preview
        onChange(updatedFiles);
        return;
      } catch (error) {
        console.error('Error creating preview:', error);
        // Vẫn cập nhật danh sách file ngay cả khi có lỗi
        onChange(latestFiles);
      }
    } else {
      // Nếu không phải file hình ảnh mới, cập nhật danh sách file bình thường
      onChange(latestFiles);
    }

    // Handle file status changes
    if (file.status === 'done') {
      message.success(`${file.name} tải lên thành công`);

      // Cập nhật URL từ server nếu có
      if (file.response && file.response.url) {
        const fileToUpdate = latestFiles.find((f) => f.uid === file.uid);
        if (fileToUpdate) {
          const updatedFile = { ...fileToUpdate, url: file.response.url } as UploadFile;
          const updatedFileList = latestFiles.map((f) => (f.uid === file.uid ? updatedFile : f));
          onChange(updatedFileList);
        }
      }
    } else if (file.status === 'error' && file.error?.name !== 'validation-error') {
      message.error(`${file.name} tải lên thất bại.`);
      console.error(`${file.name} tải lên thất bại.`);
    }
  };

  // Validate file before upload
  const beforeUpload = (file: FileType) => {
    // Custom validation if provided
    if (customValidation) {
      const isValid = customValidation(file);
      if (!isValid) {
        message.error(`File ${file.name} không hợp lệ.`);
        // Đánh dấu lỗi validation để xử lý trong handleChange
        (file as any).error = { name: 'validation-error' };
        return Upload.LIST_IGNORE;
      }
    }

    // Image validation
    if (imageOnly) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Bạn chỉ có thể tải lên file hình ảnh!');
        console.error('Bạn chỉ có thể tải lên file hình ảnh!');
        // Đánh dấu lỗi validation để xử lý trong handleChange
        (file as any).error = { name: 'validation-error' };
        return Upload.LIST_IGNORE;
      }
    }

    // Size validation
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLtMaxSize) {
      message.error(`File phải nhỏ hơn ${maxSize}MB!`);
      console.error(`File phải nhỏ hơn ${maxSize}MB!`);
      // Đánh dấu lỗi validation để xử lý trong handleChange
      (file as any).error = { name: 'validation-error' };
      return Upload.LIST_IGNORE;
    }

    // Tạo preview cho file hợp lệ
    if (file.type.startsWith('image/')) {
      // Đánh dấu file để tạo preview trong handleChange
      (file as any)._needsPreview = true;
    }

    // Prevent auto upload if needed
    return !preventAutoUpload;
  };

  // Handle preview cancel
  const handleCancel = () => setPreviewOpen(false);

  // Default empty state
  const defaultEmptyState = (
    <div className="text-center text-gray-400">
      <div className="text-3xl mb-1">
        <img src="/assets/icons/camera.svg" alt="Camera" className="w-10 h-10 mx-auto" />
      </div>
      <p className="text-sm">Chưa có ảnh</p>
    </div>
  );

  return (
    <div>
      {/* Preview container */}
      {fileList.length > 0 ? (
        <div
          className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-center mb-4 relative"
          style={{ height: '130px', ...previewContainerStyle }}
        >
          {/* Hiển thị hình ảnh preview */}
          {fileList[0].url || fileList[0].preview ? (
            <>
              <Image
                src={fileList[0].url || (fileList[0].preview as string)}
                alt="Preview"
                style={{ maxHeight: '120px', maxWidth: '100%', ...previewImageStyle }}
                preview={true}
              />
              <div
                className="absolute top-2 right-2 bg-white rounded-full p-1 cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                onClick={() => handlePreview(fileList[0])}
                title="Xem trước"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                </svg>
              </div>
            </>
          ) : fileList[0].originFileObj ? (
            // Nếu có file nhưng chưa có preview, tạo preview ngay lập tức
            <div className="text-center text-gray-400">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mr-2"></div>
                <span>Đang tải hình ảnh...</span>
              </div>
              <div className="mt-2">
                {(() => {
                  // Tự động tạo preview ngay khi render
                  if (fileList[0].originFileObj) {
                    getBase64(fileList[0].originFileObj as FileType)
                      .then((url) => {
                        const updatedFile = { ...fileList[0], preview: url };
                        onChange([updatedFile]);
                      })
                      .catch((err) => {
                        console.error('Error auto-generating preview:', err);
                      });
                  }
                  return null;
                })()}
                <button
                  className="text-blue-500 hover:text-blue-700 text-sm"
                  onClick={() => {
                    if (fileList[0].originFileObj) {
                      getBase64(fileList[0].originFileObj as FileType).then((url) => {
                        const updatedFile = { ...fileList[0], preview: url };
                        onChange([updatedFile]);
                      });
                    }
                  }}
                >
                  Tạo xem trước
                </button>
              </div>
            </div>
          ) : (
            // Trường hợp không có file hoặc không thể tạo preview
            <div className="text-center text-gray-400">
              <div className="text-3xl mb-1">
                <img src="/assets/icons/camera.svg" alt="Camera" className="w-10 h-10 mx-auto" />
              </div>
              <p className="text-sm">Không thể tạo xem trước</p>
            </div>
          )}
        </div>
      ) : (
        <div
          className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-center mb-4"
          style={{ height: '130px', ...previewContainerStyle }}
        >
          {emptyState || defaultEmptyState}
        </div>
      )}

      {/* Description */}
      {(description || subDescription) && (
        <div className="mb-3">
          {description && <Text className="text-sm">{description}</Text>}
          {subDescription && (
            <Text type="secondary" className="block mt-1 text-xs">
              {subDescription}
            </Text>
          )}
        </div>
      )}

      {/* Upload button */}
      <Upload
        name="file"
        listType={listType}
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        maxCount={maxCount}
        showUploadList={showUploadList}
        className="upload-list-inline"
        accept={accept}
      >
        <button
          type="button"
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {buttonIcon}
          <span className="ml-2">{buttonText}</span>
        </button>
      </Upload>

      {/* Preview modal */}
      <Image
        wrapperStyle={{ display: 'none' }}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => {
            setPreviewOpen(visible);
            if (!visible) handleCancel();
          },
          title: previewTitle,
        }}
        src={previewImage}
      />
    </div>
  );
};

/**
 * Static method to upload files and return URLs
 * @param files - Array of UploadFile objects to upload
 * @param options - Upload options
 * @returns Promise resolving to array of uploaded file URLs
 */
FileUpload.uploadFiles = async (
  files: UploadFile[],
  options?: {
    timeout?: number;
    customUpload?: (file: File) => Promise<any>;
    onError?: (msg: string) => void;
  },
): Promise<string[]> => {
  // Sử dụng onError callback thay vì message hook
  const timeout = options?.timeout || 30000;
  const customUpload = options?.customUpload;
  const onError = options?.onError || ((msg: string) => console.error(msg));

  // Helper function to upload with timeout
  const uploadWithTimeout = async (file: File) => {
    const uploadPromise = customUpload ? customUpload(file) : uploadFileV2(file);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Upload timeout')), timeout);
    });

    return Promise.race([uploadPromise, timeoutPromise]);
  };

  // Filter files that need to be uploaded (have originFileObj)
  const filesToUpload = files.filter((file) => file.originFileObj) as UploadFile[];

  if (filesToUpload.length === 0) {
    // Return existing URLs if no new files to upload
    return files.map((file) => file.url || '').filter(Boolean);
  }

  try {
    // Upload each file and get URLs
    const uploadedUrls = await Promise.all(
      filesToUpload.map(async (file) => {
        try {
          const response = await uploadWithTimeout(file.originFileObj as File);

          // Check response data
          if (response?.isSuccess && response?._value?.files?.length > 0) {
            // const fileData = response._value.files[0];
            return response;
          }
          throw new Error('Upload failed');
        } catch (error) {
          console.error('Error uploading file:', error);
          onError(`Không thể tải lên file ${file.name}. Vui lòng thử lại.`);
          return null;
        }
      }),
    );

    // Filter out failed uploads
    return uploadedUrls;
  } catch (error) {
    console.error('Error uploading files:', error);
    onError('Tải lên file thất bại. Vui lòng thử lại.');
    return [];
  }
};

export default FileUpload;
