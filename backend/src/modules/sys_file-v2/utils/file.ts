import { BadRequestException } from '@nestjs/common';
import fs from 'fs';
import moment from 'moment';
import path, { extname } from 'path';
import * as uuid from 'uuid';
import { FILE_FOLDER_TYPE } from '../const';

export const fileSizeFilter = (req, file, callback) => {
  if (file.size > 10000000) {
    return callback(new BadRequestException('Max size is 10MB'), false);
  }
  callback(null, true);
};

//#region filev2
export const fileFilter = (req, file, callback) => {
  if (!fileExtensionCheck(file, callback)) {
    return;
  }
  if (!fileSizeCheck(file, callback)) {
    return;
  }
  callback(null, true);
};

export const fileSizeCheck = (file, callback) => {
  if (file.size > process.env.FILE_UPLOAD_MAX_FILESIZE) {
    callback(new BadRequestException('Max size is 10MB'), false);
    return false;
  }
  return true;
};

export const fileExtensionCheck = (file, callback) => {
  if (
    !file.originalname.match(new RegExp(`\.(${process.env.FILE_UPLOAD_EXT})$`))
  ) {
    callback(
      new BadRequestException(
        `Only ${process.env.FILE_UPLOAD_EXT} are allowed!`,
      ),
      false,
    );
    return false;
  }
  return true;
};

export const editFileName = (req, file, callback) => {
  const fileExtName = extname(file.originalname);
  const date = moment().format('YYYYMMDDHHmmssSSSS');
  callback(
    null,
    `${process.env.FILE_UPLOAD_PREFIX}_${uuid.v4()}_${date}${fileExtName}`,
  );
};

export function loadFile(path) {
  if (!path) {
    return path;
  }
  if (
    ['http://', 'https://', 'data:image'].every((x) => path.indexOf(x) == -1) ==
    true
  ) {
    return `${process.env.FILE_LINK}${path}`;
  }
  return path;
}

export const getFile = (file_path, file_id) => {
  let dir = `${file_path}/${file_id}`;
  if (!fs.existsSync(dir)) {
    throw new BadRequestException('File not found');
  }
  return `${file_path}/${file_id}`;
};

export function renameFile(file_dir, oldName, newName) {
  fs.renameSync(
    path.resolve(file_dir, oldName),
    path.resolve(file_dir, newName),
  );
}

export const fileDestination = (req, file, callback) => {
  // year
  // const fileDir = moment().format("YYYY");

  // month
  const fileDir = moment().format('YYYY-MM');

  // week
  // const fileDir = moment().format("YYYY-[w]W");

  // NOTE: client phai truyen type truoc khi truyen file
  console.log(req.body)
  const fileFolderTypeAcceptClient = FILE_FOLDER_TYPE[req.body.folder_type];
  console.log(fileFolderTypeAcceptClient)
  let dir = fileFolderTypeAcceptClient
    ? `./${process.env.FILE_DIRECTORY_V2}/${fileDir}/${fileFolderTypeAcceptClient}`
    : `./${process.env.FILE_DIRECTORY_V2}/${fileDir}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  callback(null, `${dir}`);
};

export const parseViewType = (mimetype: string | string[]) => {
  //Not found
  if (!mimetype) {
    return null;
  }
  let arrViewTypes = ['image', 'video', 'audio', 'pdf'];
  for (var i = 0; i < 4; i++) {
    if (mimetype.indexOf(arrViewTypes[i]) >= 0) {
      return arrViewTypes[i];
    }
  }
  //Default
  return 'file';
};
//#endregion
