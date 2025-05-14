export class FilterPostDTO {
  page?: number;
  limit?: number;
  search_text?: string;
  category?: string;
  user_id?: number;
  followersOnly?: boolean;
}
