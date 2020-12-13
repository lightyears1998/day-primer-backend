import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";

import { Action, User } from "../entity";
import { Project } from "../entity/Project";

@Service()
@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
  async findById(id: string): Promise<Project | undefined> {
    return this.findOne({ projectId: id });
  }

  async loadOwner(project: Project): Promise<User> {
    if (!project.owner) {
      project.owner = (await this.createQueryBuilder().relation(Project, "owner").of(project).loadOne()) as User;
    }

    return project.owner;
  }

  async loadActions(project: Project): Promise<Action[]> {
    if (!project.actions) {
      project.actions = (await this.createQueryBuilder().relation(Project, "actions").of(project).loadMany()) as Action[];
    }

    return project.actions;
  }
}
