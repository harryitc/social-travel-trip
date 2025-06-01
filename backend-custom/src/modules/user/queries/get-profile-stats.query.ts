import { Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { ProfileStatsRepository } from '../repositories/profile-stats.repository';
import { UserRepository } from '../repositories/user.repository';
import { ProfileStats, UserProfileWithStats } from '../models/profile-stats.model';
import { User } from '../models/user.model';

export class GetProfileStatsQuery implements IQuery {
  constructor(
    public readonly userId: number,
    public readonly includeActivity: boolean = false,
  ) {}
}

@QueryHandler(GetProfileStatsQuery)
export class GetProfileStatsQueryHandler
  implements IQueryHandler<GetProfileStatsQuery>
{
  private readonly logger = new Logger(GetProfileStatsQuery.name);

  constructor(
    private readonly profileStatsRepository: ProfileStatsRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: GetProfileStatsQuery): Promise<any> {
    const { userId, includeActivity } = query;

    try {
      // Get user data first
      const userResult = await this.userRepository.getUserByID(userId);
      if (userResult.rowCount === 0) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const userData = new User(userResult.rows[0]);

      // Get or create profile stats
      let statsResult = await this.profileStatsRepository.getProfileStats(userId);
      
      if (statsResult.rowCount === 0) {
        // Create initial profile stats if not exists
        const completionPercentage = ProfileStats.calculateCompletionPercentage(userData);
        await this.profileStatsRepository.createProfileStats(userId, completionPercentage);
        statsResult = await this.profileStatsRepository.getProfileStats(userId);
      }

      const profileStats = new ProfileStats(statsResult.rows[0]);

      // Update completion percentage based on current user data
      const currentCompletion = ProfileStats.calculateCompletionPercentage(userData);
      if (currentCompletion !== profileStats.completion_percentage) {
        await this.profileStatsRepository.updateProfileStats({
          user_id: userId,
          completion_percentage: currentCompletion,
        });
        profileStats.completion_percentage = currentCompletion;
      }

      let recentViews = undefined;
      if (includeActivity) {
        // Get recent profile views
        const viewsResult = await this.profileStatsRepository.getRecentProfileViews(userId, 5);
        recentViews = viewsResult.rows;
      }

      // Get actual counts from related tables
      const actualCountsResult = await this.profileStatsRepository.getProfileStatsWithCounts(userId);
      if (actualCountsResult.rowCount > 0) {
        const actualCounts = actualCountsResult.rows[0];
        
        // Update stats if actual counts differ significantly
        const needsUpdate = 
          Math.abs(profileStats.posts_count - (actualCounts.actual_posts_count || 0)) > 0 ||
          Math.abs(profileStats.followers_count - (actualCounts.actual_followers_count || 0)) > 0 ||
          Math.abs(profileStats.following_count - (actualCounts.actual_following_count || 0)) > 0 ||
          Math.abs(profileStats.groups_count - (actualCounts.actual_groups_count || 0)) > 0;

        if (needsUpdate) {
          await this.profileStatsRepository.updateProfileStats({
            user_id: userId,
            posts_count: actualCounts.actual_posts_count || 0,
            followers_count: actualCounts.actual_followers_count || 0,
            following_count: actualCounts.actual_following_count || 0,
            groups_count: actualCounts.actual_groups_count || 0,
          });

          // Update local stats object
          profileStats.posts_count = actualCounts.actual_posts_count || 0;
          profileStats.followers_count = actualCounts.actual_followers_count || 0;
          profileStats.following_count = actualCounts.actual_following_count || 0;
          profileStats.groups_count = actualCounts.actual_groups_count || 0;
        }
      }

      return new UserProfileWithStats(userData, profileStats, recentViews);

    } catch (error) {
      this.logger.error(`Error getting profile stats for user ${userId}:`, error);
      throw error;
    }
  }
}
