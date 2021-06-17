import {
  Arg, Authorized, Ctx, FieldResolver, ID
} from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { AppUserContext } from "../../context";
import { Action, Project } from "../../entity";
import { ActionRepository } from "../../repo";

import {
  ActionMutation, AddActionInput, UpdateActionInput
} from "./type";

export class ActionMutationResolver {
  @InjectRepository()
  private readonly actionRepository!: ActionRepository

  @Authorized()
  @FieldResolver(() => ActionMutation)
  async addAction(@Ctx() ctx: AppUserContext, @Arg("projectId") _projectId: string, @Arg("data") data: AddActionInput): Promise<Action> {
    const project = ctx.state.project as Project;
    const action = this.actionRepository.create({ project, ...data });
    return this.actionRepository.save(action);
  }

  @Authorized()
  @FieldResolver(() => Action)
  async updateAction(@Ctx() ctx: AppUserContext, @Arg("actionId") _actionId: string, @Arg("data") data: UpdateActionInput): Promise<Action> {
    const action = ctx.state.action as Project;
    Object.assign(action, data);
    return this.actionRepository.save(action);
  }

  @Authorized()
  @FieldResolver(() => ID, { nullable: true })
  async removeAction(@Ctx() ctx: AppUserContext, @Arg("actionId", () => ID) _actionId: string): Promise<string> {
    const action = ctx.state.action as Action;
    const actionId = action.actionId;
    await this.actionRepository.remove(action);
    return actionId;
  }
}
