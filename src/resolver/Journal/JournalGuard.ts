import { ApolloError } from "apollo-server";
import {
  MiddlewareFn, NextFn, ResolverData
} from "type-graphql";
import Container from "typedi";
import { getCustomRepository } from "typeorm";

import { AppContext, AppUserContext } from "../../context";
import { Journal, User } from "../../entity";
import { JournalRepository } from "../../repo";
import { JournalService } from "../../service";
type JournalGuardArgs = {
  argKey?: string
  ctxKey?: string
}

export function LoadJournalIntoContext({ argKey = "journalId", ctxKey = "journal" }: JournalGuardArgs): MiddlewareFn<AppContext> {
  return async ({ context, args }: ResolverData<AppContext>, next: NextFn) => {
    const journalId = String(args[argKey]);
    const journal = await getCustomRepository(JournalRepository).findOne({ journalId });
    if (!journal) {
      throw new ApolloError("Journal 不存在。");
    }

    context.state[ctxKey] = journal;
    return next();
  };
}

export function ContextJournalAccessible({ ctxKey = "journal" }: Omit<JournalGuardArgs, "argKey">): MiddlewareFn<AppUserContext> {
  return async ({ context }: ResolverData<AppUserContext>, next: NextFn) => {
    const user = context.getSessionUser() as User;
    const journal = context.state[ctxKey] as Journal;

    if (!(await Container.get(JournalService).accessibleBy(journal, user))) {
      throw new ApolloError("Journal 不可访问。");
    }

    return next();
  };
}
