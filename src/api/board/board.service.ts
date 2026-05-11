import { Injectable } from '@nestjs/common';
import { LoginUser } from '../../common/decorators/user.decorator';
import { CreateBoardDto } from './dto/request/create-board.dto';
import { BoardRepository } from './board.repository';

@Injectable()
export class BoardService {
  constructor(private readonly boardRepository: BoardRepository) {}

  public async createBoard(loginUser: LoginUser, dto: CreateBoardDto) {}
}
