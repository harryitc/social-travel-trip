export class CreateCommentDTO {
  post_id: string;
  content: string;
  parent_id?: string; // For reply comments
}
