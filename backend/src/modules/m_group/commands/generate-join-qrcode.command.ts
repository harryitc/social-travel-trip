import {
  Logger,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { GenerateJoinQRCodeDto } from '../dto/generate-join-qrcode.dto';
import { Group } from '../models/group.model';
import * as crypto from 'crypto';

export class GenerateJoinQRCodeCommand implements ICommand {
  constructor(
    public readonly dto: GenerateJoinQRCodeDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(GenerateJoinQRCodeCommand)
export class GenerateJoinQRCodeCommandHandler
  implements ICommandHandler<GenerateJoinQRCodeCommand>
{
  private readonly logger = new Logger(GenerateJoinQRCodeCommand.name);

  constructor(private readonly repository: GroupRepository) {}

  async execute(command: GenerateJoinQRCodeCommand): Promise<any> {
    const { dto, userId } = command;

    // Check if group exists
    const groupResult = await this.repository.getGroupById(dto.group_id);
    if (groupResult.rowCount == 0) {
      throw new NotFoundException(`Group with ID ${dto.group_id} not found`);
    }

    // Verify admin permission
    const membersResult = await this.repository.getGroupMembers(dto.group_id);
    const adminMember = membersResult.rows.find(
      (member) => member.user_id == userId && member.role == 'admin',
    );

    if (!adminMember) {
      throw new UnauthorizedException('Only admin can generate join QR code');
    }

    // Generate a random join code
    const joinCode = crypto.randomBytes(16).toString('hex');

    // Set expiration time (default to 24 hours if not specified)
    let expiresAt = null;
    if (dto.expiration_time) {
      expiresAt = new Date(dto.expiration_time);
    } else {
      expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // Default: 24 hours from now
    }

    // Save the join code to the group
    const result = await this.repository.updateGroupJoinCode(
      dto.group_id,
      joinCode,
      expiresAt,
    );

    // Generate QR code data
    const qrCodeData = {
      type: 'group_join',
      join_code: joinCode,
      group_id: dto.group_id,
      expires_at: expiresAt.toISOString(),
    };

    // Create a shareable URL for the QR code
    const shareableUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/trips/join?code=${joinCode}`;

    return {
      group: new Group(result.rows[0]),
      join_code: joinCode,
      expires_at: expiresAt,
      qr_code_data: JSON.stringify(qrCodeData),
      shareable_url: shareableUrl,
      qr_text: joinCode, // Simple text for QR generation on frontend
    };
  }
}
