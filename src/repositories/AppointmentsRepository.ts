import { EntityRepository, Repository } from 'typeorm';
import Appointment from '../models/Appointment';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  public async findByDate(date: Date): Promise<Appointment | null> {
    const findAppontment = await this.findOne({
      where: {
        date,
      },
    });
    return findAppontment || null;
  }
}

export default AppointmentsRepository;
