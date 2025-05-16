import _ from "lodash";
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateIf, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { FILE_TYPE } from "../const";

// class ResizeOption {
//     @Transform(numberTransform)
//     @IsNotEmpty()
//     @IsNumber()
//     @IsPositive()
//     public width: number;

//     @Transform(numberTransform)
//     @IsNotEmpty()
//     @IsNumber()
//     @IsPositive()
//     public height: number;

//     @IsOptional()
//     @IsEnum(ImageFit)
//     public fit: ImageFit = ImageFit.COVER;
// }

// class ScaleOption {
//     @ValidateIf(o => _.isNil(o.ratio))
//     @Transform(numberTransform)
//     @IsNotEmpty()
//     @IsNumber()
//     @IsPositive()
//     public width: number;

//     @ValidateIf(o => _.isNil(o.width))
//     @Transform(numberTransform)
//     @IsNotEmpty()
//     @IsNumber()
//     @IsPositive()
//     public ratio: number;
// }

export class FileUploadDto {
    @IsNotEmpty()
    @IsString()
    @IsEnum(FILE_TYPE)
    public type: string;

    @IsOptional()
    @IsString()
    public ext: string;

    @IsOptional()
    @IsString()
    public folder_type: string;

    // @Transform(jsonParseTransform)
    // @Type(() => ResizeOption)
    // @IsOptional()
    // @IsArray()
    // public resize: ResizeOption[] = [];

    // @Transform(jsonParseTransform)
    // @Type(() => ScaleOption)
    // @IsOptional()
    // @IsArray()
    // public scale: ScaleOption[] = [];

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    public resize: string[]; // vd: ['1','2']

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    public scale: string[];
}
