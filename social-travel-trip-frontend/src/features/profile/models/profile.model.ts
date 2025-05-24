export class UserProfile {
  user_id: number;
  username: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  date_of_birth?: Date;
  gender?: boolean;
  address?: string;
  avatar_url?: string;
  created_at?: Date;
  updated_at?: Date;

  constructor(data: any) {
    this.user_id = data.user_id;
    this.username = data.username;
    this.full_name = data.full_name;
    this.email = data.email;
    this.phone_number = data.phone_number;
    this.date_of_birth = data.date_of_birth ? new Date(data.date_of_birth) : undefined;
    this.gender = data.gender;
    this.address = data.address;
    this.avatar_url = data.avatar_url;
    this.created_at = data.created_at ? new Date(data.created_at) : undefined;
    this.updated_at = data.updated_at ? new Date(data.updated_at) : undefined;
  }

  /**
   * Get user's display name
   */
  get displayName(): string {
    return this.full_name || this.username;
  }

  /**
   * Get user's initials for avatar
   */
  get initials(): string {
    if (this.full_name) {
      const names = this.full_name.split(' ');
      return names.map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);
    }
    return this.username.charAt(0).toUpperCase();
  }

  /**
   * Get formatted date of birth
   */
  get formattedDateOfBirth(): string | undefined {
    if (!this.date_of_birth) return undefined;
    return this.date_of_birth.toLocaleDateString('vi-VN');
  }

  /**
   * Get gender display text
   */
  get genderText(): string {
    if (this.gender === undefined || this.gender === null) return 'Chưa xác định';
    return this.gender ? 'Nam' : 'Nữ';
  }

  /**
   * Check if profile is complete
   */
  get isProfileComplete(): boolean {
    return !!(this.full_name && this.email && this.phone_number);
  }

  /**
   * Get profile completion percentage
   */
  get completionPercentage(): number {
    const fields = [
      this.full_name,
      this.email,
      this.phone_number,
      this.date_of_birth,
      this.gender !== undefined,
      this.address,
      this.avatar_url
    ];

    const completedFields = fields.filter(field => !!field).length;
    return Math.round((completedFields / fields.length) * 100);
  }

  /**
   * Convert to storage format
   */
  toStorageFormat(): any {
    return {
      user_id: this.user_id,
      username: this.username,
      full_name: this.full_name,
      email: this.email,
      phone_number: this.phone_number,
      date_of_birth: this.date_of_birth,
      gender: this.gender,
      address: this.address,
      avatar_url: this.avatar_url,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}
