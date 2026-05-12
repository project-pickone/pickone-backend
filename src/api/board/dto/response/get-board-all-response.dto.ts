import { BoardOverviewEntity } from '../../entity/board-overview.entity';

export class GetBoardAllResponseDto {
  boardList: BoardOverviewEntity[];
  count: number;
}
