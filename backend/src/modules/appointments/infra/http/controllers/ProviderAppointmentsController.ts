import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import AppError from '@shared/errors/AppError';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { day, month, year } = request.query;
    if (!day || !month || !year)
      throw new AppError('day, month and year are required', 400);
    const listProviderAppointmentsService = container.resolve(
      ListProviderAppointmentsService,
    );
    const nDay = +day;
    const nMonth = +month;
    const nYear = +year;

    const appointments = await listProviderAppointmentsService.execute({
      provider_id,
      month: nMonth,
      year: nYear,
      day: nDay,
    });

    return response.json(appointments);
  }
}
