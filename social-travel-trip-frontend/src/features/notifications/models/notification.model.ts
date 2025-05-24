import { get } from 'lodash';

export class NotificationModel {
  notify_id: string;
  json_data: any;
  type: string;
  is_read: boolean;
  created_at: string;
  user_created: string;

  constructor(data: any) {
    this.notify_id = get(data, 'notify_id', -1);
    this.json_data = get(data, 'json_data', {});
    this.type = get(data, 'type', '');
    this.is_read = get(data, 'is_read', false);
    this.created_at = get(data, 'created_at', '');
    this.user_created = get(data, 'user_created', '');
  }
}
