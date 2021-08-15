import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });
  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    const appointment = await createAppointment.execute({
      date: new Date(2021, 8, 10, 11),
      user_id: '123456',
      provider_id: '123123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123123');
  });
  it('should not be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    const appointmentDate = new Date(2021, 10, 16, 11);
    await createAppointment.execute({
      user_id: '123456',
      date: appointmentDate,
      provider_id: '123123123',
    });
    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: '123456',
        provider_id: '1212323123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    await expect(
      createAppointment.execute({
        date: new Date(2020, 3, 10, 11),
        user_id: '123456',
        provider_id: '1212323123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create appointments to self', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    await expect(
      createAppointment.execute({
        date: new Date(2020, 5, 10, 11),
        user_id: '123456',
        provider_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create appointments outside of range (08:00 - 17:00)', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 5, 10, 7),
        user_id: '123456',
        provider_id: '123456578',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 5, 10, 18),
        user_id: '123456',
        provider_id: '123456578',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
