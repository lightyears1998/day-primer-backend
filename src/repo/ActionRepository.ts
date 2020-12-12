import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";

import { Action } from "../entity";
import { Project } from "../entity/Project";

@Service()
@EntityRepository(Action)
export class ActionRepository extends Repository<Action> {
  async findById(id: string): Promise<Action | undefined> {
    return this.findOne({ actionId: id });
  }

  async loadProject(action: Action): Promise<Project> {
    if (!action.project) {
      action.project = (await this.createQueryBuilder().relation(Action, "project").of(action).loadOne()) as Project;
    }

    return action.project;
  }
}
