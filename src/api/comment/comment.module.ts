import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { BoardRepository } from '../board/board.repository';

@Module({
  imports: [],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, BoardRepository],
  exports: [],
})
export class CommentModule {}
