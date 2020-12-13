import { ApolloError } from "apollo-server";
import {
  MiddlewareFn, NextFn, ResolverData
} from "type-graphql";
import Container from "typedi";
import { getCustomRepository } from "typeorm";

import { AppContext, AppUserContext } from "../../context";
import { Action, User } from "../../entity";
import { ActionRepository } from "../../repo";
import { ActionService } from "../../service/ActionService";

type ActionGuardArgs = {
  argKey?: string
  ctxKey?: string
}

export function LoadActionIntoContext({ argKey = "actionId", ctxKey = "action" }: ActionGuardArgs): MiddlewareFn<AppContext> {
  return async ({ context, args }: ResolverData<AppContext>, next: NextFn) => {
    const actionId = String(args[argKey]);
    const action = await getCustomRepository(ActionRepository).findOne({ actionId });
    if (!action) {
      throw new ApolloError("Action 不存在。");
    }

    context.state[ctxKey] = action;
    return next();
  };
}

export function ContextActionAccessible({ ctxKey = "action" }: Omit<ActionGuardArgs, "argKey">): MiddlewareFn<AppUserContext> {
  return async ({ context }: ResolverData<AppUserContext>, next: NextFn) => {
    const user = context.getSessionUser() as User;
    const action = context.state[ctxKey] as Action;

    if (!(await Container.get(ActionService).accessibleBy(action, user))) {
      throw new ApolloError("Action 无法访问");
    }

    return next();
  };
}
