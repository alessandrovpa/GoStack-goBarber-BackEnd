import { startOfHour } from 'date-fns';
import Appointment from '../models/Appointment';

import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface RequestDTO {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private appointmentsRepository: AppointmentsRepository;

  constructor(appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public execute({ provider, date }: RequestDTO): Appointment {
    const startHour = startOfHour(date);
    const verifyHourAvaiable = this.appointmentsRepository.findByDate(
      startHour,
    );
    if (verifyHourAvaiable) {
      throw Error('Hour not avaiable');
    }

    const appointment = this.appointmentsRepository.create({
      provider,
      date: startHour,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
