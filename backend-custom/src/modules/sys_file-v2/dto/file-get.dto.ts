import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID } from "class-validator";

export class FileGetListDto {
    @IsNotEmpty()
    @IsArray()
    @ApiProperty({
        example: [
            "FILEUPLOAD_0c725fea-dcd0-4ace-be89-89d885705f59_202402021035017960.png",
            "FILEUPLOAD_c45a752b-f381-472e-91eb-7c273eef0342_202402021034516000.png"
        ]
    })
    list_server_file_name: string[];

    @IsOptional()
    @IsUUID()
    @ApiProperty({ example: "8680a55a-225d-4bca-ad17-21e4a84bbd7d" })
    session_id: string;
}

export class FileDownloadDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: "aaa" })
    server_file_name: string;
}
