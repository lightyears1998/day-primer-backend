import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver
} from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Journal, User } from "../../entity";
import { JournalRepository, UserRepository } from "../../repo";
import { defaultPaginationArgs, PaginationArgs } from "../Pagination";
import { AppUserContext } from "../../context";

import {
  AddJournalInput, JournalMutation, PaginatedJournalResponse, UpdateJournalInput
} from "./type";

@Resolver(() => JournalMutation)
export class JournalMutationResolver {
  @InjectRepository()
  private readonly userRepository!: UserRepository

  @InjectRepository()
  private readonly journalRepository!: JournalRepository

  @Authorized()
  @FieldResolver(() => Journal)
  async addJournal(@Ctx() ctx: AppUserContext, @Arg("data") data: AddJournalInput): Promise<Journal> {
    const user = ctx.getSessionUser() as User;
    const journal = this.journalRepository.create({ owner: user });
    Object.assign(journal, data);
    return this.journalRepository.save(journal);
  }

  @Authorized()
  @FieldResolver(() => Journal)
  async updateJournal(@Ctx() ctx: AppUserContext, @Arg("journalId") _journalId: string, @Arg("data") data: UpdateJournalInput): Promise<Journal> {
    const journal = ctx.state.journal as Journal;
    Object.assign(journal, data);
    return this.journalRepository.save(journal);
  }

  @Authorized()
  @FieldResolver(() => ID, { nullable: true })
  async removeJournal(@Ctx() ctx: AppUserContext, @Arg("journalId", () => ID) _journalId: string): Promise<string> {
    const journal = ctx.state.journal as Journal;
    const journalId = journal.journalId;
    await this.journalRepository.remove(journal);
    return journalId;
  }
}
