import { Service } from "typedi";
import {
  EntityManager, EntityRepository, Repository
} from "typeorm";
import { InjectManager } from "typeorm-typedi-extensions";

import { Journal, User } from "../entity";
import { Project } from "../entity/Project";
import { PaginationArgs } from "../resolver/Pagination/PaginationArgs";

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  @InjectManager()
  manager!: EntityManager

  async loadProjects(user: User): Promise<Project[]> {
    if (!user.projects) {
      user.projects = await this.createQueryBuilder().relation(User, "projects").of(user).loadMany();
    }
    return user.projects;
  }

  async loadJournals(user: User, { skip, take }: PaginationArgs): Promise<Journal[]> {
    if (!user.journals) {
      user.journals = await this.manager.find(Journal, {
        where: { owner: user }, skip, take
      });
    }

    return user.journals;
  }

  async countJournals(user: User): Promise<number> {
    return this.manager.count(Journal, { where: { owner: user } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.findOne({ userId: id });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.findOne({ username });
  }
}
