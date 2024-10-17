import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import { BaseController } from './base.controller';

export class UserController extends BaseController<User> {
  constructor() {
    super(UserService);
  }
}
