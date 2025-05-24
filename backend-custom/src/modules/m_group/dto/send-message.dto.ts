import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  ValidateIf,
} from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  group_id: number;

  @ApiProperty({
    required: false,
    description: 'Message content. Required if no attachments are provided.',
  })
  @ValidateIf(
    (o) =>
      !o.attachments ||
      (Array.isArray(o.attachments) && o.attachments.length === 0),
  )
  @IsNotEmpty({
    message: 'Message content is required when no attachments are provided',
  })
  @IsString()
  message?: string;

  @ApiProperty({
    required: false,
    description: 'ID of the message being replied to',
  })
  @IsOptional()
  @IsNumber()
  reply_to_message_id?: number;

  @ApiProperty({
    required: false,
    description: 'Attachments (images, files, etc.)',
    example: [
      {
        type: 'image',
        url: 'https://example.com/image.jpg',
        name: 'image.jpg',
        size: 1024,
      },
    ],
  })
  @IsOptional()
  @IsObject({ each: true })
  attachments?: Array<{
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: number;
  }>;
}
