import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { AnimeRoute } from '@routes/animes.route';
import { RecordRoute } from '@routes/records.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new UserRoute(), new AuthRoute(), new AnimeRoute(), new RecordRoute()]);

app.listen();
