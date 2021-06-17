import {
  Resolver, FieldResolver, ResolverInterface, Root
} from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Action } from "../../entity";
import { ActionRepository } from "../../repo";
import { Project } from "../../entity";

@Service()
@Resolver(() => Action)
export class ActionResolver implements ResolverInterface<Action> {
  @InjectRepository()
  private readonly actionRepository!: ActionRepository

  @FieldResolver(() => Project)
  async project(@Root() action: Action): Promise<Project> {
    if (!action.project) {
      action.project = await this.actionRepository.loadProject(action);
    }

    return action.project;
  }
}
