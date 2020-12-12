import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";

import { User } from "../entity";

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findById(id: number): Promise<User | undefined> {
    return this.findOne({ userId: id });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.findOne({ username });
  }
}
