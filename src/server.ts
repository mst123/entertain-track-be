import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { AnimeRoute } from '@routes/animes.route';
import { MangaRoute } from '@routes/mangas.route';
import { RecordRoute } from '@routes/records.route';
import { GameRoute } from '@routes/games.route';
import { MenuRoute } from '@routes/menus.route';
import { BookRoute } from '@routes/books.route';
import { FileRoute } from '@routes/files.route';
import { BillRoute } from '@routes/bills.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([
  new UserRoute(),
  new AuthRoute(),
  new AnimeRoute(),
  new MangaRoute(),
  new RecordRoute(),
  new GameRoute(),
  new MenuRoute(),
  new BookRoute(),
  new FileRoute(),
  new BillRoute(),
]);

app.listen();
