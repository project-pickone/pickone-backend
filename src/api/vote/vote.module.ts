import { Module } from '@nestjs/common';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { VoteRepository } from './vote.repository';
import { BoardRepository } from '../board/board.repository';

@Module({
  imports: [],
  controllers: [VoteController],
  providers: [VoteService, VoteRepository, BoardRepository],
  exports: [],
})
export class VoteModule {}
