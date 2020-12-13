import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Project, User } from "../entity";
import { ProjectRepository } from "../repo";

@Service()
export class ProjectService {
  @InjectRepository()
  private readonly projectRepository!: ProjectRepository

  async accessibleBy(project: Project, user: User): Promise<boolean> {
    const projectOwner = await this.projectRepository.loadOwner(project);

    if (projectOwner.userId === user.userId) {
      return true;
    }

    return false;
  }
}
