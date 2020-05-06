import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import User from '../models/User';

import authConfig from '../config/auth';

interface RequestDTO {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class CreateSessionService {
  public async execute({ email, password }: RequestDTO): Promise<Response> {
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne({ where: { email } });
    if (!user) {
      throw Error('Invalid email and/or password');
    }

    const verifyPassword = await compare(password, user.password);
    if (!verifyPassword) {
      throw Error('Invalid email and/or password');
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default CreateSessionService;
