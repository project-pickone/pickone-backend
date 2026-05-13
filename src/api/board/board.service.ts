import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginUser } from '../../common/decorators/user.decorator';
import { CreateBoardDto } from './dto/request/create-board.dto';
import { BoardRepository } from './board.repository';
import { BoardEntity } from './entity/board.entity';
import { GetBoardAllRequestDto } from './dto/request/get-board-all.dto';
import { BoardOverviewEntity } from './entity/board-overview.entity';
import { UpdateBoardDto } from './dto/request/update-board.dto';

@Injectable()
export class BoardService {
  constructor(private readonly boardRepository: BoardRepository) {}

  public async getBoardAll(dto: GetBoardAllRequestDto, loginUser: LoginUser) {
    return {
      boardList: (
        await this.boardRepository.selectBoardAll(dto, loginUser.id)
      ).map(BoardOverviewEntity.fromPrisma),
      count: await this.boardRepository.selectBoardCount(dto),
    };
  }

  public async createBoard(
    loginUser: LoginUser,
    dto: CreateBoardDto,
  ): Promise<BoardEntity> {
    const cratedBoard = await this.boardRepository.insertBoard(
      dto,
      loginUser.id,
    );

    return BoardEntity.fromPrisma(cratedBoard);
  }

  public async updateBoardByIdx(
    idx: number,
    dto: UpdateBoardDto,
    loginUser: LoginUser,
  ): Promise<void> {
    const board = await this.boardRepository.selectBoardByIdx(idx);

    if (!board) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (board.author.id !== loginUser.id) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    await this.boardRepository.updateBoardByIdx(idx, dto);
  }

  public async deleteBoardByIdx(idx: number, loginUser: LoginUser) {
    const board = await this.boardRepository.selectBoardByIdx(idx);

    if (!board) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (board.author.id !== loginUser.id) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    await this.boardRepository.deleteBoardByIdx(idx);
  }
}
