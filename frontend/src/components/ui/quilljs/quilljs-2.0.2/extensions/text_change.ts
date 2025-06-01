import Delta from '../lib/quill-delta-5.1.0/Delta';
import Quill from '../core';
import { EditorEvents } from './events';
import { QuilljsYoutubeHelper } from './youtube.ext';
import { VideoConfig } from '../../config/video.config';
import { convertImageTypeToExt } from '../../config/quill_file_uploader.config';

/**
 * Convert base64Image to File
 * @param base64Image
 * @returns
 */
const convertBase64ImageToFile = async (base64Image: string): Promise<File> => {
  return fetch(base64Image)
    .then((res) => {
      return res.blob();
    })
    .then((blob) => {
      return new File([blob], 'File_name.' + convertImageTypeToExt(blob.type), { type: blob.type });
    });
};
/**
 * Check base64 image
 * bmp,gif,ico,jpg,png,svg,webp,x-icon
 */
const ImageTypes = [
  'bmp',
  'gif',
  'ico',
  'jpg',
  'jpeg',
  'png',
  'apng',
  'svg+xml',
  'webp',
  'x-icon',
  'avif',
];
const isBase64ImageString = (base64Image: string) => {
  if (!base64Image) {
    return false;
  }
  for (const t of ImageTypes) {
    if (base64Image.startsWith(`data:image/${t};base64,`)) {
      return true;
    }
  }
  //NO!
  return false;
};
/**
 * Error handler
 * @param base64Image
 */
const uploadImageErrorHandler = (quill: Quill, base64Image: string) => {
  ///Do something
  console.log('Upload base64 image Error handler');
};
/**
 * Upload base64 image to server
 * @param base64Image
 * @returns
 */
const uploadBase64Image = async (base64Image: string) => {
  const file: File = await convertBase64ImageToFile(base64Image);
  return await uploadFile(file);
};
/**
 * Upload binary file to server
 * @param file
 * @returns
 */
const uploadFile = async (file: File): Promise<string> => {
  if (!Quill.fileUploader) {
    return '';
  }
  return await Quill.fileUploader(file);
};
/**
 * Check youtube iframes
 * 1. Hide related videos
 */

const checkYoutubeIframes = () => {
  const iframes = document.getElementsByTagName('iframe');
  for (let iframe of iframes) {
    const videoType = iframe.getAttribute('data-video-type');
    if (videoType === 'youtube' || videoType === 'youtube-short') {
      if (VideoConfig.noRel === true) {
        QuilljsYoutubeHelper.hideRelatedVideos(iframe);
      }
    }
  }
};
/**
 * TEXT_CHANGE tasks
 */
const QuillTextChangeHandler = async (
  quill: Quill,
  { delta, oldDelta, source }: { delta: Delta; oldDelta: Delta; source: 'api' | 'user' | 'silent' },
) => {
  /**
   * Youtube player
   */
  checkYoutubeIframes();
  //Check readonly
  if (quill.options.readOnly) {
    return;
  }
  ///Search images from nodes
  SearchImagesFromNodes(quill, quill.getLines());
};
const formatImageBlot = async (quill: Quill, leaf: any, domNode: HTMLImageElement) => {
  const base64Image = domNode.src;
  const formats = leaf.formats && leaf.formats();
  //id
  let id = formats?.id ?? `quilljs-img-${Date.now().toString()}`;
  if (leaf.format && !formats?.id) {
    ///Set id
    leaf.format('id', id);
  }
  ///Upload
  if (base64Image) {
    if (isBase64ImageString(base64Image)) {
      if (!quill.uploadedBase64Images.has(id)) {
        ///Add to uploading base64 images
        quill.uploadedBase64Images.set(id, base64Image);
        ///Upload
        UploadBase64Image(quill, { base64Image, id });
      }
    }
  }
};
const SearchImagesFromNodes = (quill: Quill, nodes: any[]) => {
  let leaf: any, domNode: any;
  for (let line of nodes) {
    leaf = line.children?.head;
    while (leaf) {
      domNode = leaf.domNode;

      ///Node is image
      if (domNode instanceof Image) {
        formatImageBlot(quill, leaf, domNode);
      } ///Node has children
      else {
        SearchImagesInLine(quill, leaf);
      }

      ///NEXT Leaf
      leaf = leaf.next;
    }
  }
};
const SearchImagesInLine = (quill: Quill, line: any) => {
  let leaf: any, domNode: any, children: any;
  leaf = line.children?.head;
  while (leaf) {
    domNode = leaf.domNode;
    children = leaf.children;

    ///Node is image
    if (domNode instanceof Image) {
      formatImageBlot(quill, leaf, domNode);
    }

    ///NEXT Leaf
    leaf = leaf.next;
  }
};
const UploadBase64Image = async (
  quill: Quill,
  { id, base64Image }: { base64Image: string; id: string },
) => {
  try {
    ///Upload
    const uploadedFileUrl = await uploadBase64Image(base64Image);
    //Update base64 to url
    quill.uploadedBase64Images.set(id, uploadedFileUrl);
    ///Emit event
    quill.emitter.emit(EditorEvents.CONTENT_CHANGE);
  } catch (error) {
    ///Remove uploading base64 images
    quill.uploadedBase64Images.delete(id);
    //Error --> do something...
    uploadImageErrorHandler(quill, base64Image);
  }
};
//Export
export { QuillTextChangeHandler };
