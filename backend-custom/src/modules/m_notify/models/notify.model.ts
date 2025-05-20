export class Notification {
  notify_id: number;
  json_data: any;
  type: string;
  is_read: boolean;
  created_at: Date;
  user_created: number;
  user_updated: number;

  constructor(data: any) {
    this.notify_id = data.notify_id;
    this.json_data = data.json_data;
    this.type = data.type;
    this.is_read = data.is_read == '1' || data.is_read == true;
    this.created_at = data.created_at ? new Date(data.created_at) : new Date();
    this.user_created = data.user_created;
    this.user_updated = data.user_updated;
  }

  static fromRow(row: any): Notification {
    return new Notification(row);
  }
}