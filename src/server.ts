import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { AnimeRoute } from '@routes/animes.route';
import { MangaRoute } from '@routes/mangas.route';
import { RecordRoute } from '@routes/records.route';
import { GameRoute } from '@routes/games.route';
import { FileRoute } from '@routes/files.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new UserRoute(), new AuthRoute(), new AnimeRoute(), new MangaRoute(), new RecordRoute(), new GameRoute(), new FileRoute()]);

app.listen();
