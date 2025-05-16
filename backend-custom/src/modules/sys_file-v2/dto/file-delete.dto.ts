import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class FileDeleteDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    example: [
      'FILEUPLOAD_0c725fea-dcd0-4ace-be89-89d885705f59_202402021035017960.png',
      'FILEUPLOAD_c45a752b-f381-472e-91eb-7c273eef0342_202402021034516000.png',
    ],
  })
  list_server_file_name: string[];
}
