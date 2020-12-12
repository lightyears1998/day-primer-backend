import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";

import { User } from "../entity";
import { Project } from "../entity/Project";

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findById(id: number): Promise<User | undefined> {
    return this.findOne({ userId: id });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.findOne({ username });
  }

  async loadProjects(user: User): Promise<Project[]> {
    if (!user.projects) {
      user.projects = await this.createQueryBuilder().relation(User, "projects").of(user).loadMany();
    }
    return user.projects;
  }
}
