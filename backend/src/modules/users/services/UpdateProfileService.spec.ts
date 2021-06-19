import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
    });

    expect(updatedUser.name).toBe('Jhon Doe');
    expect(updatedUser.email).toBe('jhondoe@example.com');
  });
  it('should not be able to update email to an email already in use', async () => {
    await fakeUsersRepository.create({
      name: 'user',
      email: 'jhondoe@example.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Jhon Doe',
        email: 'jhondoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to update password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });
  it('should not be able to update password if old password is not provided', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Jhon Doe',
        email: 'jhondoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Jhon Doe',
        email: 'jhondoe@example.com',
        password: '123123',
        old_password: 'wrong_old_password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update profile with unexistent user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'non-existing-user',
        name: 'Jhon Doe',
        email: 'jhondoe@example.com',
        password: '123123',
        old_password: 'wrong_old_password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
