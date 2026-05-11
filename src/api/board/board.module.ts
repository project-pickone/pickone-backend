import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { BoardRepository } from './board.repository';

@Module({
  imports: [],
  controllers: [BoardController],
  providers: [BoardService, BoardRepository],
  exports: [],
})
export class BoardModule {}
