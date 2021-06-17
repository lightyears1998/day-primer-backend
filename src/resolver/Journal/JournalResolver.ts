import {
  Arg,
  Authorized,
  Ctx,
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
  AddJournalInput, PaginatedJournalResponse, UpdateJournalInput
} from "./type";

@Resolver(() => Journal)
export class JournalResolver {
  @InjectRepository()
  private readonly userRepository!: UserRepository

  @InjectRepository()
  private readonly journalRepository!: JournalRepository

  @Authorized()
  @Query(() => PaginatedJournalResponse)
  async journals(
    @Ctx() ctx: AppUserContext,
    @Arg("pagination", { nullable: true, defaultValue: defaultPaginationArgs }) { skip, take }: PaginationArgs
  ): Promise<PaginatedJournalResponse> {
    const user = ctx.getSessionUser() as User;
    const journals = await this.userRepository.loadJournals(user, { skip, take });
    const total = await this.userRepository.countJournals(user);
    return new PaginatedJournalResponse(journals, skip, take, total);
  }

  @Authorized()
  @Query(() => [Journal])
  async journalsOfToday(): Promise<Journal[]> {
    return this.journalRepository.findByDate(new Date());
  }

  @Authorized()
  @Query(() => [Journal], { nullable: true })
  async journalsOf(@Arg("date") date: Date): Promise<Journal[]> {
    return this.journalRepository.findByDate(new Date(date));
  }

  @Authorized()
  @Mutation(() => Journal)
  async addJournal(@Ctx() ctx: AppUserContext, @Arg("data") data: AddJournalInput): Promise<Journal> {
    const user = ctx.getSessionUser() as User;
    const journal = this.journalRepository.create({ owner: user });
    Object.assign(journal, data);
    return this.journalRepository.save(journal);
  }

  @Authorized()
  @Mutation(() => Journal)
  async updateJournal(@Ctx() ctx: AppUserContext, @Arg("journalId") _journalId: string, @Arg("data") data: UpdateJournalInput): Promise<Journal> {
    const journal = ctx.state.journal as Journal;
    Object.assign(journal, data);
    return this.journalRepository.save(journal);
  }

  @Authorized()
  @Mutation(() => ID, { nullable: true })
  async removeJournal(@Ctx() ctx: AppUserContext, @Arg("journalId", () => ID) _journalId: string): Promise<string> {
    const journal = ctx.state.journal as Journal;
    const journalId = journal.journalId;
    await this.journalRepository.remove(journal);
    return journalId;
  }
}
