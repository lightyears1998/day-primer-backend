import { Inject, Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Action, User } from "../entity";
import { ActionRepository } from "../repo";

import { ProjectService } from "./ProjectService";

@Service()
export class ActionService {
  @InjectRepository()
  private readonly actionRepository!: ActionRepository

  @Inject(() => ProjectService)
  private readonly projectService!: ProjectService

  async accessibleBy(action: Action, user: User): Promise<boolean> {
    const actionProject = await this.actionRepository.loadProject(action);
    return this.projectService.accessibleBy(actionProject, user);
  }
}
