import { ApolloError } from "apollo-server";
import {
  MiddlewareFn, NextFn, ResolverData
} from "type-graphql";
import { getCustomRepository } from "typeorm";

import { AppContext, AppUserContext } from "../../context";
import { Project, User } from "../../entity";
import { ProjectRepository } from "../../repo";

type ProjectGuardArgs = {
  argKey?: string
  ctxKey?: string
}

export function LoadProjectIntoContext({ argKey = "projectId", ctxKey = "project" }: ProjectGuardArgs): MiddlewareFn<AppContext> {
  return async ({ context, args }: ResolverData<AppContext>, next: NextFn) => {
    const projectId = String(args[argKey]);
    const project = await getCustomRepository(ProjectRepository).findOne({ projectId });
    if (!project) {
      throw new ApolloError("Project 不存在。");
    }

    context.state[ctxKey] = project;
    return next();
  };
}

export function ContextProjectAccessible({ ctxKey = "project" }: Omit<ProjectGuardArgs, "argKey">): MiddlewareFn<AppUserContext> {
  return async ({ context }: ResolverData<AppUserContext>, next: NextFn) => {
    const user = context.getSessionUser() as User;
    const project = context.state[ctxKey] as Project;
    const projectOwner = await getCustomRepository(ProjectRepository).loadOwner(project);

    if (projectOwner.userId !== user.userId) {
      throw new ApolloError("Project 不可访问。");
    }

    return next();
  };
}
