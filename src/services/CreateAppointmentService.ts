import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';

import AppError from '../errors/AppError';

import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface RequestDTO {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({
    provider_id,
    date,
  }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const startHour = startOfHour(date);
    const verifyHourAvaiable = await appointmentsRepository.findByDate(
      startHour,
    );
    if (verifyHourAvaiable) {
      throw new AppError('Hour not avaiable');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: startHour,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
