import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list appointments in a day', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 9, 20, 11).getTime();
    });

    const appointment = await fakeAppointmentsRepository.create({
      user_id: '123456',
      provider_id: 'user',
      date: new Date(2021, 9, 20, 14, 0, 0),
    });
    const appointment2 = await fakeAppointmentsRepository.create({
      user_id: '123456',
      provider_id: 'user',
      date: new Date(2021, 9, 20, 15, 0, 0),
    });

    const availability = await listProviderAppointments.execute({
      provider_id: 'user',
      year: 2021,
      month: 10,
      day: 20,
    });

    expect(availability).toEqual([appointment, appointment2]);
  });
});
