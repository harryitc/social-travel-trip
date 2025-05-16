# FileUpload Component

A reusable file upload component with preview, validation, and error handling capabilities.

## Features

- Image preview với nút xem trước rõ ràng
- File validation (size, type) với xử lý lỗi chặt chẽ
- Ngăn chặn hiển thị file không hợp lệ trong preview
- Error handling với thông báo rõ ràng
- Loading states
- Customizable UI
- Static upload method for direct file uploads

## Basic Usage

```tsx
import { useState } from 'react';
import { UploadFile } from 'antd';
import FileUpload from '@/components/ui/FileUpload';

const MyComponent = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleFileListChange = (newFileList: UploadFile[]) => {
    setFileList(newFileList);
  };

  return (
    <FileUpload
      fileList={fileList}
      onChange={handleFileListChange}
      maxSize={2}
      maxCount={1}
      buttonText="Tải Lên Hình Ảnh"
      description="Tải lên ảnh bìa cho khóa học"
      subDescription="Chúng tôi khuyến bạn nên sử dụng hình ảnh có tỉ lệ 2:1 (Chiều ngang:Chiều dọc)."
    />
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| fileList | UploadFile[] | - | Current file list |
| onChange | (fileList: UploadFile[]) => void | - | Callback when file list changes |
| maxSize | number | 2 | Maximum file size in MB |
| maxCount | number | 1 | Maximum number of files |
| showUploadList | boolean | false | Whether to show the upload list |
| buttonText | string | "Tải Lên Hình Ảnh" | Upload button text |
| buttonIcon | React.ReactNode | <PlusOutlined /> | Upload button icon |
| listType | UploadProps['listType'] | "picture" | Upload list type |
| accept | string | "image/*" | Accepted file types |
| customValidation | (file: FileType) => boolean \| Promise<boolean> | - | Custom validation function |
| description | string | - | Description text |
| subDescription | string | - | Secondary description text |
| previewContainerStyle | React.CSSProperties | - | Preview container style |
| previewImageStyle | React.CSSProperties | - | Preview image style |
| emptyState | React.ReactNode | - | Empty state component |
| preventAutoUpload | boolean | true | Whether to prevent auto upload |
| imageOnly | boolean | true | Whether to only allow image files |

## Static Upload Method

The component provides a static method for uploading files directly:

```tsx
// Upload files and get URLs
const uploadedUrls = await FileUpload.uploadFiles(fileList, {
  onError: (errorMsg) => message.error(errorMsg)
});

// With all options
const uploadedUrls = await FileUpload.uploadFiles(fileList, {
  timeout: 60000, // 60 seconds timeout
  customUpload: myCustomUploadFunction,
  onError: (errorMsg) => message.error(errorMsg) // Handle errors
});
```

## Example with Form Submission

```tsx
import { useState } from 'react';
import { Form, Button, UploadFile, message } from 'antd';
import FileUpload from '@/components/ui/FileUpload';

const MyForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileListChange = (newFileList: UploadFile[]) => {
    setFileList(newFileList);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();

      // Upload files if needed
      let fileUrl = '';
      if (fileList.length > 0) {
        const uploadedUrls = await FileUpload.uploadFiles(fileList);
        if (uploadedUrls.length > 0) {
          fileUrl = uploadedUrls[0];
        }
      }

      // Submit form data with file URL
      const formData = {
        ...values,
        imageUrl: fileUrl
      };

      // Call your API to save the data
      // await saveData(formData);

      message.success('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item label="Title" name="title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Image">
        <FileUpload
          fileList={fileList}
          onChange={handleFileListChange}
          description="Upload an image"
        />
      </Form.Item>

      <Button
        type="primary"
        onClick={handleSubmit}
        loading={isSubmitting}
      >
        Submit
      </Button>
    </Form>
  );
};
```

## Best Practices

1. Always handle loading states during upload
2. Provide clear validation messages
3. Use the static `uploadFiles` method for form submissions
4. Set appropriate file size limits
5. Customize the empty state for better UX
6. Use the `imageOnly` prop when you only want to accept images
7. Sử dụng `previewContainerStyle` và `previewImageStyle` để tùy chỉnh kích thước và giao diện của phần xem trước
8. Sử dụng `customValidation` để thêm các quy tắc kiểm tra tùy chỉnh

## Xử lý Validation

Component sử dụng `Upload.LIST_IGNORE` để ngăn chặn file không hợp lệ được thêm vào danh sách. Các bước xử lý validation:

1. Kiểm tra file trong hàm `beforeUpload`
2. Nếu file không hợp lệ, đánh dấu với `error.name = 'validation-error'`
3. Trả về `Upload.LIST_IGNORE` để ngăn chặn file được thêm vào danh sách
4. Kiểm tra lại trong `handleChange` để đảm bảo file lỗi không được cập nhật vào state

Nhờ đó, người dùng sẽ chỉ thấy thông báo lỗi mà không thấy file không hợp lệ được hiển thị trong preview.
