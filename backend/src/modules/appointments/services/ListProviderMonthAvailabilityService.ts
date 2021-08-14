import { getDate, getDaysInMonth } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
  }: IRequest): Promise<number[]> {
    const appointments =
      await this.appointmentsRepository.findAllInMonthByProvider({
        provider_id,
        year,
        month,
      });
    const eachDayFromMonth = Array.from(
      { length: getDaysInMonth(month) },
      (_, index) => index + 1,
    );

    const availableDays = eachDayFromMonth.map(day => {
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });
      if (appointmentsInDay.length < 10) return day;
      return 0;
    });
    const result = availableDays.filter(day => day !== 0);
    return result;
  }
}
