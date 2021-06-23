import {
  Resolver, FieldResolver, ResolverInterface, Root
} from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

import {
  Action, User, Project
} from "../../entity";
import { ProjectRepository } from "../../repo";

@Service()
@Resolver(() => Project)
export class ProjectResolver implements ResolverInterface<Project> {
  // @InjectRepository()
  // private readonly projectRepository!: ProjectRepository

  // @FieldResolver()
  // async owner(@Root() project: Project): Promise<User> {
  //   return this.projectRepository.loadOwner(project);
  // }

  // @FieldResolver(() => [Action])
  // async actions(@Root() project: Project): Promise<Action[]> {
  //   return this.projectRepository.loadActions(project);
  // }
}
