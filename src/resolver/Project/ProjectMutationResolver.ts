import {
  Ctx, Mutation, Arg, Authorized, ID, FieldResolver, Resolver
} from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Project } from "../../entity";
import { AppUserContext } from "../../context";
import { ProjectRepository } from "../../repo";

import { AddProjectInput, ProjectMutation } from "./type";
import { UpdateProjectInput } from "./type";

@Resolver(() => ProjectMutation)
export class ProjectMutationResolver {
  @InjectRepository()
  private readonly projectRepository!: ProjectRepository

  @FieldResolver(() => String)
  sf() {
    return "";
  }

  // @Authorized()
  // @FieldResolver(() => Project)
  // async addProject(@Ctx() ctx: AppUserContext, @Arg("data") data: AddProjectInput): Promise<Project> {
  //   const user = ctx.getSessionUser();
  //   const project = this.projectRepository.create({ owner: user, ...data });
  //   return this.projectRepository.save(project);
  // }

  // @Authorized()
  // @FieldResolver(() => Project)
  // async updateProject(@Ctx() ctx: AppUserContext, @Arg("projectId") _projectId: string, @Arg("data") data: UpdateProjectInput): Promise<Project> {
  //   const project = ctx.state.project as Project;
  //   Object.assign(project, data);
  //   return this.projectRepository.save(project);
  // }

  // @Authorized()
  // @FieldResolver(() => ID, { nullable: true })
  // async removeProject(@Ctx() ctx: AppUserContext, @Arg("projectId", () => ID) _projectId: string): Promise<string> {
  //   const project = ctx.state.project as Project;
  //   const projectId = project.projectId;
  //   await this.projectRepository.remove(project);
  //   return projectId;
  // }
}
