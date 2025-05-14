import { Module } from '@nestjs/common';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';

@Module({
  imports: [],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
