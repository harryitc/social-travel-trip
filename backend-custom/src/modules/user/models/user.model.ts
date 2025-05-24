export class User {
  user_id: number;
  username: string;
  password?: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  date_of_birth?: Date;
  gender?: boolean | null;
  address?: string;
  avatar_url?: string;
  json_data?: any;
  created_at?: Date;
  updated_at?: Date;

  constructor(data: any) {
    this.user_id = data.user_id;
    this.username = data.username;
    this.full_name = data.full_name;
    this.email = data.email;
    this.phone_number = data.phone_number;
    this.date_of_birth = data.date_of_birth;

    // Convert bit to boolean
    if (data.gender !== null && data.gender !== undefined) {
      if (typeof data.gender === 'string') {
        this.gender = data.gender === '1';
      } else if (Buffer.isBuffer(data.gender)) {
        this.gender = data.gender[0] === 1;
      } else {
        this.gender = Boolean(data.gender);
      }
    } else {
      this.gender = null;
    }

    this.address = data.address;
    this.avatar_url = data.avatar_url;
    this.json_data = data.json_data;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;

    // Remove password from response
    delete this.password;
  }
}