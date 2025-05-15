import {
  Controller,
  Get,
  Post,
  Query,
  Request,
  HttpCode,
  Body,
  UseInterceptors,
  UploadedFiles,
  Header,
  StreamableFile,
  Sse,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { FileDownloadDto, FileGetListDto } from './dto/file-get.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { FileService } from './file.service';
import { FILE_UPLOAD_PREFIX } from './const';
import { fileDestination, editFileName, fileFilter } from './utils/file';
import { FileDeleteDto } from './dto/file-delete.dto';

@ApiTags('File')
@Controller(`${FILE_UPLOAD_PREFIX}/file-v2`)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({
    summary: 'Lay list hoi nhom theo id',
    description: ``,
  })
  @HttpCode(200)
  @Post('get-list')
  public async getListById(@Body() body: FileGetListDto, @Request() req: any) {
    body['userId'] = req['user'].id;
    if (body.session_id) {
      this.fileService.fileGetListInfo(
        body.list_server_file_name,
        body.session_id,
      );
      return;
    }

    return this.fileService.fileGetListInfo(body.list_server_file_name);
  }

  @HttpCode(200)
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', +process.env.FILE_UPLOAD_MAX_FILE_COUNT, {
      storage: diskStorage({
        destination: fileDestination,
        filename: editFileName,
      }),
      fileFilter: fileFilter,
    }),
  )
  @ApiOperation({
    summary: '',
    description: `
      - TODO: Nam ro co che stream file
      - 
    `,
  })
  async fileUpload(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: FileUploadDto,
    @Request() req: any,
  ) {
    body['userId'] = req['user'].id;
    return this.fileService.fileUpload(body, files);
  }

  @HttpCode(200)
  @Get('download')
  @Header('Content-Type', 'application/octet-stream')
  @Header('Content-Disposition', `attachment; filename="download"`)
  async fileDownload(@Query() query: FileDownloadDto, @Request() req: any) {
    let file = await this.fileService.fileDownload(query.server_file_name);
    return new StreamableFile(file);
  }

  @ApiOperation({
    summary: '',
    description: `
    `,
  })
  @HttpCode(200)
  @Sse('get-list/response')
  public fileGetListResponse(
    @Query('session_id') session_id,
    @Request() request: any,
  ): Observable<MessageEvent> | any {
    return this.fileService.fileGetListResponse(session_id);
  }

  // @HttpCode(200)
  // @Get('get/:file_id')
  // @Header('Content-Type', 'application/octet-stream')
  // @Header('Content-Disposition', `attachment; filename="download"`)
  // async fileGet(@Param() params: FileGetDto, @Request() req: any) {
  //   params["userId"] = await this.cacheUserAuthService.getUserId(req);
  //   let file = await this.fileService.fileGet(params);
  //   return new StreamableFile(file);
  // }

  @HttpCode(200)
  @Post('delete')
  async fileDelete(@Body() body: FileDeleteDto, @Request() req: any) {
    await this.fileService.fileDelete(body);
    return { status: true };
  }
}
