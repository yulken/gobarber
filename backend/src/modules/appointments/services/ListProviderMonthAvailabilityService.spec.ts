import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list month availability by provider', async () => {
    const promises = Array.from({ length: 10 }, (_, index) => {
      return fakeAppointmentsRepository.create({
        provider_id: 'user',
        date: new Date(2021, 9, 20, index + 8, 0, 0),
      });
    });
    await Promise.all(promises);

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'user',
      year: 2021,
      month: 10,
    });

    expect(availability).toEqual(expect.not.arrayContaining([20]));
    expect(availability).toEqual(expect.arrayContaining([19, 21, 22]));
  });
});
