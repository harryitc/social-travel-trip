import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ProfileStatsRepository } from '../repositories/profile-stats.repository';
import { UpdateProfileStatsDTO } from '../dto/profile-stats.dto';
import { ProfileStats } from '../models/profile-stats.model';

export class UpdateProfileStatsCommand implements ICommand {
  constructor(
    public readonly data: UpdateProfileStatsDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdateProfileStatsCommand)
export class UpdateProfileStatsCommandHandler
  implements ICommandHandler<UpdateProfileStatsCommand>
{
  private readonly logger = new Logger(UpdateProfileStatsCommand.name);

  constructor(private readonly repository: ProfileStatsRepository) {}

  async execute(command: UpdateProfileStatsCommand): Promise<any> {
    const { data, userId } = command;

    try {
      // Verify user is updating their own stats or is admin
      if (data.user_id !== userId) {
        // In a real app, check if user is admin here
        throw new NotFoundException(
          'You can only update your own profile stats',
        );
      }

      // Check if profile stats exist
      const existingStats = await this.repository.getProfileStats(data.user_id);

      if (existingStats.rowCount === 0) {
        // Create initial stats if not exists
        await this.repository.createProfileStats(
          data.user_id,
          data.completion_percentage || 0,
        );
      }

      // Update profile stats
      const result = await this.repository.updateProfileStats(data);

      if (result.rowCount === 0) {
        throw new NotFoundException(
          `Profile stats for user ${data.user_id} not found`,
        );
      }

      return new ProfileStats(result.rows[0]);
    } catch (error) {
      this.logger.error(
        `Error updating profile stats for user ${data.user_id}:`,
        error,
      );
      throw error;
    }
  }
}

export class RecordProfileViewCommand implements ICommand {
  constructor(
    public readonly viewerId: number,
    public readonly profileOwnerId: number,
  ) {}
}

@CommandHandler(RecordProfileViewCommand)
export class RecordProfileViewCommandHandler
  implements ICommandHandler<RecordProfileViewCommand>
{
  private readonly logger = new Logger(RecordProfileViewCommand.name);

  constructor(private readonly repository: ProfileStatsRepository) {}

  async execute(command: RecordProfileViewCommand): Promise<any> {
    const { viewerId, profileOwnerId } = command;

    try {
      // Don't record self-views
      if (viewerId === profileOwnerId) {
        return { message: 'Self-view not recorded' };
      }

      // Record the profile view
      await this.repository.recordProfileView({
        viewer_id: viewerId,
        profile_owner_id: profileOwnerId,
      });

      // Increment profile views count
      const result =
        await this.repository.incrementProfileViews(profileOwnerId);

      if (result.rowCount === 0) {
        // Create initial stats if not exists
        await this.repository.createProfileStats(profileOwnerId, 0);
        await this.repository.incrementProfileViews(profileOwnerId);
      }

      return { message: 'Profile view recorded successfully' };
    } catch (error) {
      this.logger.error(`Error recording profile view:`, error);
      throw error;
    }
  }
}
