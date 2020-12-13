import {
  Resolver, Ctx, Mutation, Arg, Authorized, FieldResolver, ResolverInterface, Root, ID, Args, UseMiddleware, Query
} from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Action, User } from "../../entity";
import { AppUserContext } from "../../context";
import { Project } from "../../entity/Project";
import { ProjectRepository } from "../../repo/ProjectRepository";

import { AddProjectArgs } from "./AddProjectArgs";
import { ContextProjectAccessible, LoadProjectIntoContext } from "./ProjectGuard";
import { UpdateProjectArgs } from "./UpdateProjectArgs";

@Service()
@Resolver(() => Project)
export class ProjectResolver implements ResolverInterface<Project> {
  @InjectRepository()
  private readonly projectRepository!: ProjectRepository

  @FieldResolver()
  async owner(@Root() project: Project): Promise<User> {
    return this.projectRepository.loadOwner(project);
  }

  @FieldResolver(() => [Action])
  async actions(@Root() project: Project): Promise<Action[]> {
    return this.projectRepository.loadActions(project);
  }

  @Authorized()
  @Mutation(() => Project)
  async addProject(@Ctx() ctx: AppUserContext, @Args() { name } : AddProjectArgs): Promise<Project> {
    const user = ctx.getSessionUser();
    const project = this.projectRepository.create({ owner: user, name });
    return this.projectRepository.save(project);
  }

  @Authorized()
  @UseMiddleware(
    LoadProjectIntoContext({ argKey: "projectId", ctxKey: "project" }),
    ContextProjectAccessible({ ctxKey: "project" })
  )
  @Mutation(() => Project)
  async updateProject(@Ctx() ctx: AppUserContext, @Args() args: UpdateProjectArgs): Promise<Project> {
    const project = ctx.state.project as Project;
    Object.assign(project, args);
    return this.projectRepository.save(project);
  }

  @Authorized()
  @UseMiddleware(
    LoadProjectIntoContext({ argKey: "projectId", ctxKey: "project" }),
    ContextProjectAccessible({ ctxKey: "project" })
  )
  @Mutation(() => ID, { nullable: true })
  async removeProject(@Ctx() ctx: AppUserContext, @Arg("projectId", () => ID) _projectId: string): Promise<string> {
    const project = ctx.state.project as Project;
    const projectId = project.projectId;
    await this.projectRepository.remove(project);
    return projectId;
  }
}
