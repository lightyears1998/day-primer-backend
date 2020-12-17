import {
  Resolver, Ctx, Mutation, Arg, Authorized, FieldResolver, ResolverInterface, Root, ID, UseMiddleware
} from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

import {
  Action, User, Project
} from "../../entity";
import { AppUserContext } from "../../context";
import { ProjectRepository } from "../../repo/ProjectRepository";
import { AddProjectInput } from "../../types/Project";
import { UpdateProjectInput } from "../../types/Project";

import { ContextProjectAccessible, LoadProjectIntoContext } from "./ProjectGuard";

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
  async addProject(@Ctx() ctx: AppUserContext, @Arg("data") data: AddProjectInput): Promise<Project> {
    const user = ctx.getSessionUser();
    const project = this.projectRepository.create({ owner: user, ...data });
    return this.projectRepository.save(project);
  }

  @Authorized()
  @UseMiddleware(
    LoadProjectIntoContext({ argKey: "projectId", ctxKey: "project" }),
    ContextProjectAccessible({ ctxKey: "project" })
  )
  @Mutation(() => Project)
  async updateProject(@Ctx() ctx: AppUserContext, @Arg("projectId") _projectId: string, @Arg("data") data: UpdateProjectInput): Promise<Project> {
    const project = ctx.state.project as Project;
    Object.assign(project, data);
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
