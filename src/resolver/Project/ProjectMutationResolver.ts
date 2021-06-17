import {
  Ctx, Mutation, Arg, Authorized, ID
} from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Project } from "../../entity";
import { AppUserContext } from "../../context";
import { ProjectRepository } from "../../repo/ProjectRepository";

import { AddProjectInput } from "./type";
import { UpdateProjectInput } from "./type";

export class ProjectMutationResolver {
  @InjectRepository()
  private readonly projectRepository!: ProjectRepository

  @Authorized()
  @Mutation(() => Project)
  async addProject(@Ctx() ctx: AppUserContext, @Arg("data") data: AddProjectInput): Promise<Project> {
    const user = ctx.getSessionUser();
    const project = this.projectRepository.create({ owner: user, ...data });
    return this.projectRepository.save(project);
  }

  @Authorized()
  @Mutation(() => Project)
  async updateProject(@Ctx() ctx: AppUserContext, @Arg("projectId") _projectId: string, @Arg("data") data: UpdateProjectInput): Promise<Project> {
    const project = ctx.state.project as Project;
    Object.assign(project, data);
    return this.projectRepository.save(project);
  }

  @Authorized()
  @Mutation(() => ID, { nullable: true })
  async removeProject(@Ctx() ctx: AppUserContext, @Arg("projectId", () => ID) _projectId: string): Promise<string> {
    const project = ctx.state.project as Project;
    const projectId = project.projectId;
    await this.projectRepository.remove(project);
    return projectId;
  }
}
