import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User, Refresh } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';

/**
 * Generates a token for the user with optional refresh token.
 *
 * @param {User} user - the user object to generate token for
 * @param {boolean} needRefresh - flag to determine if a refresh token is needed, defaults to true
 * @return {TokenData} the generated token data
 */
const createToken = (user: User, needRefresh = true): TokenData => {
  const dataStoredInToken: DataStoredInToken = { _id: user._id };
  const expiresIn: number = 60 * 60 * 4;
  const freshExpiresIn: number = 60 * 60 * 24 * 30;
  // jwt 在外边又包了一层
  return {
    expiresIn,
    accessToken: sign(dataStoredInToken, SECRET_KEY, { expiresIn }),
    ...(needRefresh
      ? {
          refresh: {
            refreshToken: sign(dataStoredInToken, SECRET_KEY, { expiresIn: freshExpiresIn }),
            expiresIn: freshExpiresIn,
          },
        }
      : {}),
  };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.accessToken}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
export class AuthService {
  public async signup(userData: User): Promise<User> {
    const findUser: User = await UserModel.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    // TODO 不允许注册超级管理员
    const createUserData: User = await UserModel.create({ ...userData, password: hashedPassword, userPermission: 'user' });

    return createUserData;
  }

  public async login(userData: User): Promise<{ cookie: string; findUser: User; refresh?: Refresh }> {
    const findUser: User = await UserModel.findOne({ email: userData.email }).select('+password');
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);

    return { cookie, findUser, refresh: tokenData.refresh };
  }

  public async getRefreshToken(refreshToken: string): Promise<{ cookie: string }> {
    try {
      const { _id } = (await verify(refreshToken, SECRET_KEY)) as DataStoredInToken;
      const findUser = await UserModel.findById(_id);
      if (findUser) {
        const tokenData = createToken(findUser, false);
        const cookie = createCookie(tokenData);
        return { cookie };
      } else {
        throw new HttpException(401, 'refresh token is not valid');
      }
    } catch (error) {
      throw new HttpException(401, 'refresh token is not valid');
    }
  }
}
