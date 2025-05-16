import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '@nestjs/cqrs';
import path from "path";
import _ from 'lodash';
import { ForbiddenException, LogicErrorException, InternalServerErrorException } from '@common/exceptions';
import { AppAssetsProvider } from '@configs/assets/app-assets.provider';
import { FileRepository } from '../repository/file.repository';

import { FILE_TYPE } from '../const';
import { FileEntity } from '../model/File.model';
import { ImageExt, convertWebp, getBlurHash, getResizeDirName, getScaleDirName, resize, scale } from '@common/utils/image';
import { parseViewType, renameFile, getFile } from '../utils/file';

export class FileUploadCommand implements ICommand {
  constructor(
    public user_id: string,
    public ext: string,
    public resize: any,
    public scale: any,
    public files: any,
  ) { }
}

@CommandHandler(FileUploadCommand)
export class FileUploadCommandHandler
  implements ICommandHandler<FileUploadCommand> {
  constructor(
    private readonly repository: FileRepository,
    private readonly assets: AppAssetsProvider,
  ) { }

  async execute(command: FileUploadCommand): Promise<{ files: any[] }> {
    if (command.files.length === 0) {
      throw new ForbiddenException('FILE IS EMPTY');
    }

    let files = []
    let fileImageConfig;
    try {
      fileImageConfig = this.assets.getJsonFile('file_upload_option.json');
      fileImageConfig = JSON.parse(fileImageConfig)
    } catch (error) {
      throw new InternalServerErrorException("Need File Option Config")
    }

    let diff = _.difference(command.scale, _.keys(fileImageConfig["scale"]))
    if (diff.length > 0) {
      throw new LogicErrorException(`option scale ${diff.join(',')} khong ton tai`)
    }

    diff = _.difference(command.resize, _.keys(fileImageConfig["resize"]))
    if (diff.length > 0) {
      throw new LogicErrorException(`option resize ${diff.join(',')} khong ton tai`)
    }

    for (let i = 0; i < command.files.length; i++) {
      let file: FileEntity = command.files[i];
      let viewType = parseViewType(file.mimetype)
      let fileHash = ""
      let resizePath = {}
      let fileExt = path.extname(file.filename)
      if (_.isEmpty(fileExt) && command.ext) {
        fileExt = command.ext;
        renameFile(file.destination, file.filename, file.filename += `.${fileExt}`)
      }

      switch (viewType) {
        case FILE_TYPE.IMAGE:
          fileHash = await getBlurHash(getFile(file.destination, file.filename));
          if (fileExt !== ImageExt.WEBP) {
            await convertWebp(getFile(file.destination, file.filename), file.destination, file.filename)
            file.filename = file.filename.replace(fileExt, ImageExt.WEBP)
          }

          if ((command.scale && command.scale.length > 0) || (command.resize && command.resize.length > 0)) {

            if (command.scale && command.scale.length > 0) {
              for (let j = 0; j < command.scale.length; j++) {
                let scaleOption = command.scale[j];
                let width = fileImageConfig["scale"][scaleOption]?.width;
                let ratio = fileImageConfig["scale"][scaleOption]?.ratio;
                let dirScale = `${file.destination}/${getScaleDirName(width, ratio)}`
                await scale(getFile(file.destination, file.filename), dirScale, file.filename, width, ratio)
                resizePath[`${getScaleDirName(width, ratio)}`] = `/${getScaleDirName(width, ratio)}`
              }
            }

            if (command.resize && command.resize.length > 0) {

              for (let j = 0; j < command.resize.length; j++) {
                let resizeOption = command.resize[j];
                let width = fileImageConfig["resize"][resizeOption]?.width;
                let height = fileImageConfig["resize"][resizeOption]?.height;
                let fit = fileImageConfig["resize"][resizeOption]?.fit;
                let dirResize = `${file.destination}/${getResizeDirName(width, height)}`
                await resize(getFile(file.destination, file.filename), dirResize, file.filename, width, height, fit)
                resizePath[`${getResizeDirName(width, height)}`] = `/${getResizeDirName(width, height)}`
              }
            }

            break;
          }

          break;

        default:
          break;
      }

      files.push({
        client_filename: file.originalname,
        server_filename: file.filename,
        file_ext: fileExt,
        file_group: "default",
        file_size: file.size,
        file_type: file.mimetype,
        filepath: file.destination.replace(`./${process.env.FILE_DIRECTORY_V2}`, ''),
        view_type: viewType,
        file_hash: fileHash,
        resize_path: resizePath
      })

    }

    await this.repository.create(command.user_id, files);

    files = files.map(file => {
      return {
        domain: `${process.env.FILE_LINK}/${process.env.FILE_DIRECTORY_V2}`,
        server_file_name: file.server_filename,
        file_url: path.join(file.filepath, file.server_filename),
        file_name: file.client_filename,
        file_hash: file.file_hash,
      }
    })

    return { files };
  }
}
