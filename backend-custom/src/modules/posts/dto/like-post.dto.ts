export class LikePostDTO {
  post_id: string;
  reaction_type?: string; // 'like' | 'love' | 'haha' | 'wow' | 'sad'
}
