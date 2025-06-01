// Export all upload components
export { ImageUploadWithCrop } from '../image-upload-with-crop';
export { SimpleImageUpload } from '../simple-image-upload';
export { AvatarUpload } from '../avatar-upload';

// Export hooks
export { useFileUpload, uploadImage, uploadDocument, uploadAvatar } from '../../../hooks/use-file-upload';
export type { UploadConfig, UploadResult, UseFileUploadReturn } from '../../../hooks/use-file-upload';
