import { Game } from '@interfaces/games.interface';
import { GameService } from '@services/games.service';
import { BaseController } from './base.controller';
export class GameController extends BaseController<Game> {
  constructor() {
    super(GameService);
  }
}
