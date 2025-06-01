export class ProfileStats {
  user_id: number;
  completion_percentage: number;
  profile_views: number;
  posts_count: number;
  followers_count: number;
  following_count: number;
  groups_count: number;
  trips_count: number;
  last_active?: Date;
  created_at?: Date;
  updated_at?: Date;

  constructor(data: any) {
    this.user_id = data.user_id;
    this.completion_percentage = data.completion_percentage || 0;
    this.profile_views = data.profile_views || 0;
    this.posts_count = data.posts_count || 0;
    this.followers_count = data.followers_count || 0;
    this.following_count = data.following_count || 0;
    this.groups_count = data.groups_count || 0;
    this.trips_count = data.trips_count || 0;
    this.last_active = data.last_active ? new Date(data.last_active) : undefined;
    this.created_at = data.created_at ? new Date(data.created_at) : undefined;
    this.updated_at = data.updated_at ? new Date(data.updated_at) : undefined;
  }

  /**
   * Calculate profile completion percentage based on user data
   */
  static calculateCompletionPercentage(userData: any): number {
    const fields = [
      userData.full_name,
      userData.email,
      userData.phone_number,
      userData.date_of_birth,
      userData.gender !== undefined && userData.gender !== null,
      userData.address,
      userData.avatar_url
    ];

    const completedFields = fields.filter(field => !!field).length;
    return Math.round((completedFields / fields.length) * 100);
  }

  /**
   * Get completion status text
   */
  get completionStatus(): string {
    if (this.completion_percentage >= 90) return 'Hoàn thiện';
    if (this.completion_percentage >= 70) return 'Gần hoàn thiện';
    if (this.completion_percentage >= 50) return 'Trung bình';
    return 'Cần cập nhật';
  }

  /**
   * Get completion status color
   */
  get completionStatusColor(): string {
    if (this.completion_percentage >= 90) return 'green';
    if (this.completion_percentage >= 70) return 'blue';
    if (this.completion_percentage >= 50) return 'orange';
    return 'red';
  }
}

export class ProfileView {
  view_id?: number;
  viewer_id: number;
  profile_owner_id: number;
  viewed_at?: Date;
  created_at?: Date;

  constructor(data: any) {
    this.view_id = data.view_id;
    this.viewer_id = data.viewer_id;
    this.profile_owner_id = data.profile_owner_id;
    this.viewed_at = data.viewed_at ? new Date(data.viewed_at) : undefined;
    this.created_at = data.created_at ? new Date(data.created_at) : undefined;
  }
}

export class UserProfileWithStats {
  user: any;
  stats: ProfileStats;
  recent_views?: ProfileView[];

  constructor(userData: any, statsData: any, viewsData?: any[]) {
    this.user = userData;
    this.stats = new ProfileStats(statsData);
    this.recent_views = viewsData ? viewsData.map(view => new ProfileView(view)) : undefined;
  }

  /**
   * Get formatted stats for display
   */
  get formattedStats() {
    return {
      completion: {
        percentage: this.stats.completion_percentage,
        status: this.stats.completionStatus,
        color: this.stats.completionStatusColor
      },
      activity: {
        profile_views: this.stats.profile_views,
        posts_count: this.stats.posts_count,
        last_active: this.stats.last_active
      },
      social: {
        followers_count: this.stats.followers_count,
        following_count: this.stats.following_count,
        groups_count: this.stats.groups_count
      },
      travel: {
        trips_count: this.stats.trips_count
      }
    };
  }
}
