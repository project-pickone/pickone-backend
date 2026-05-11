import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';

@Module({
  imports: [],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [],
})
export class BoardModule {}
