import fs from 'fs';
import path from 'path';
import { getRepository } from 'typeorm';
import User from '../models/User';

import uploadConfig from '../config/upload';

interface RequestDTO {
  avatarFilename: string;
  user_id: string;
}

class UpdateUserAvatarService {
  public async execute({ avatarFilename, user_id }: RequestDTO): Promise<User> {
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw Error('User does not exist');
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const avatarExist = await fs.promises.stat(userAvatarFilePath);
      if (avatarExist) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;
    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
