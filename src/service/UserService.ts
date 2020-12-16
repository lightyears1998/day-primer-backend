import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import bcrypt from "bcrypt";

import { User } from "../entity";
import { UserRepository } from "../repo";

@Service()
export class UserService {
  @InjectRepository()
  private readonly userRepository!: UserRepository

  async registerUser(username: string, password: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

    const user = this.userRepository.save(this.userRepository.create({
      username,
      passwordHash
    }));

    return user;
  }

  async matchPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  async updatePassword(user: User, password: string): Promise<void> {
    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());
    user.passwordHash = passwordHash;
    await this.userRepository.save(user);
  }
}
