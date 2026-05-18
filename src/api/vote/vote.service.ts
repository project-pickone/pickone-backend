import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VoteRepository } from './vote.repository';
import { BoardRepository } from '../board/board.repository';
import { LoginUser } from '../../common/decorators/user.decorator';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class VoteService {
  constructor(
    private readonly voteRepository: VoteRepository,
    private readonly boardRepository: BoardRepository,
  ) {}

  @Transactional()
  public async voteBoard(
    boardIdx: number,
    optionIdx: number,
    loginUser: LoginUser,
  ) {
    const board = await this.boardRepository.selectBoardByIdx(
      boardIdx,
      loginUser.id,
    );

    if (!board) {
      throw new NotFoundException('cannot find board');
    }

    if (board.options.findIndex((option) => option.idx === optionIdx) === -1) {
      throw new BadRequestException('cannot find option');
    }

    const vote = await this.voteRepository.selectVote(optionIdx, loginUser.id);

    if (vote) {
      throw new ConflictException('already voted');
    }

    await this.voteRepository.increaseOptionCount(optionIdx);
    return await this.voteRepository.insertVote(optionIdx, loginUser.id);
  }
}
