import { v4 as uuidv4 } from 'uuid';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import IUserTokenRepository from '../IUserTokensRepository';

export default class FakeUserTokensRepository implements IUserTokenRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();
    Object.assign(userToken, {
      id: uuidv4(),
      token: uuidv4(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });
    this.userTokens.push(userToken);
    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    return this.userTokens.find(findToken => findToken.token === token);
  }
}
