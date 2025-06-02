import { CreatePostCommandHandler } from './create-post.command';
import { LikePostCommandHandler } from './like-post.command';
import { UpdatePostCommandHandler } from './update-post.command';

export const CommandHandlers = [
  CreatePostCommandHandler,
  LikePostCommandHandler,
  UpdatePostCommandHandler,
];
