import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';

import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface RequestDTO {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider, date }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const startHour = startOfHour(date);
    const verifyHourAvaiable = await appointmentsRepository.findByDate(
      startHour,
    );
    if (verifyHourAvaiable) {
      throw Error('Hour not avaiable');
    }

    const appointment = appointmentsRepository.create({
      provider,
      date: startHour,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
