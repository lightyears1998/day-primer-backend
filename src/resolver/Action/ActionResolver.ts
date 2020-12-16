import {
  Resolver, Ctx, Mutation, Arg, Authorized, FieldResolver, ResolverInterface, Root, UseMiddleware, ID
} from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Action } from "../../entity";
import { AppUserContext } from "../../context";
import { ActionRepository } from "../../repo";
import { Project } from "../../entity";
import { ContextProjectAccessible, LoadProjectIntoContext } from "../Project";

import { AddActionInput, UpdateActionInput } from "./types";
import { ContextActionAccessible, LoadActionIntoContext } from "./ActionGuard";

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

  @Authorized()
  @UseMiddleware(
    LoadProjectIntoContext({ argKey: "projectId", ctxKey: "project" }),
    ContextProjectAccessible({ ctxKey: "project" })
  )
  @Mutation(() => Action)
  async addAction(@Ctx() ctx: AppUserContext, @Arg("projectId") _projectId: string, @Arg("data") data: AddActionInput): Promise<Action> {
    const project = ctx.state.project as Project;
    const action = this.actionRepository.create({ project, ...data });
    return this.actionRepository.save(action);
  }

  @Authorized()
  @UseMiddleware(
    LoadActionIntoContext({ argKey: "actionId", ctxKey: "action" }),
    ContextActionAccessible({ ctxKey: "action" })
  )
  @Mutation(() => Action)
  async updateAction(@Ctx() ctx: AppUserContext, @Arg("actionId") _actionId: string, @Arg("data") data: UpdateActionInput): Promise<Action> {
    const action = ctx.state.action as Project;
    Object.assign(action, data);
    return this.actionRepository.save(action);
  }

  @Authorized()
  @UseMiddleware(
    LoadActionIntoContext({ argKey: "actionId", ctxKey: "action" }),
    ContextActionAccessible({ ctxKey: "action" })
  )
  @Mutation(() => ID, { nullable: true })
  async removeAction(@Ctx() ctx: AppUserContext, @Arg("actionId", () => ID) _actionId: string): Promise<string> {
    const action = ctx.state.action as Action;
    const actionId = action.actionId;
    await this.actionRepository.remove(action);
    return actionId;
  }
}
