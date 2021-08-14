import { getRepository, Not, Repository } from 'typeorm';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.ormRepository.findOne(id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });
    return user;
  }

  public async findAllProviders({
    id_exception,
  }: IFindAllProvidersDTO): Promise<User[]> {
    if (id_exception) {
      return this.ormRepository.find({
        where: {
          id: Not(id_exception),
        },
      });
    }
    return this.ormRepository.find();
  }

  public async findByDate(date: Date): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({
      where: { date },
    });
    return findUser || undefined;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);
    await this.ormRepository.save(user);
    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
