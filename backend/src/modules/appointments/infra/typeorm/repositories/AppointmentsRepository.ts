import { getRepository, Between, Repository } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthByProviderDTO from '@modules/appointments/dtos/IFindAllInMonthByProviderDTO';
import IFindAllInDayByProviderDTO from '@modules/appointments/dtos/IFindAllInDayByProviderDTO';
import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    });
    return findAppointment || undefined;
  }

  public async findAllInMonthByProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthByProviderDTO): Promise<Appointment[]> {
    const firstDate = new Date(year, month + 1, 1);
    const lastDate = new Date(year, month + 2, 1);
    lastDate.setDate(lastDate.getDate() - 1);

    const appointments = this.ormRepository.find({
      where: {
        provider_id,
        date: Between(firstDate, lastDate),
      },
    });

    return appointments;
  }

  public async findAllInDayByProvider({
    provider_id,
    month,
    year,
    day,
  }: IFindAllInDayByProviderDTO): Promise<Appointment[]> {
    const firstDate = new Date(year, month - 1, day);
    const lastDate = new Date(year, month - 1, day + 1);
    lastDate.setMinutes(lastDate.getMinutes() - 1);

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Between(firstDate, lastDate),
      },
    });
    return appointments;
  }

  public async create({
    user_id,
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      user_id,
      provider_id,
      date,
    });
    await this.ormRepository.save(appointment);
    return appointment;
  }
}

export default AppointmentsRepository;
