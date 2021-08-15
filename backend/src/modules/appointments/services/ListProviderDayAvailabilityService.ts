import { getHours, isAfter } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

@injectable()
export default class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<number[]> {
    const appointments =
      await this.appointmentsRepository.findAllInDayByProvider({
        provider_id,
        year,
        month,
        day,
      });
    const hourStart = 8;
    const eachHourFromDays = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    const currentDate = new Date(Date.now());
    const availableHours = eachHourFromDays.map(hour => {
      const appointmentsInHour = appointments.filter(appointment => {
        return getHours(appointment.date) === hour;
      });
      const comparisonDate = new Date(year, month - 1, day, hour);

      if (
        appointmentsInHour.length === 0 &&
        isAfter(comparisonDate, currentDate)
      )
        return hour;
      return 0;
    });

    const result = availableHours.filter(hour => hour !== 0);
    return result;
  }
}
