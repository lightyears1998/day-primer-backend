import {
  Arg,
  Authorized,
  Mutation,
  Query, Resolver
} from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Journal } from "../../entity";
import { JournalRepository } from "../../repo";

import { AddJournalInput } from "./types";

@Resolver(() => Journal)
export class JournalResolver {
  @InjectRepository()
  private readonly journalRepository!: JournalRepository

  @Authorized()
  @Query(() => [Journal])
  async journals(): Promise<Journal[]> {
    return [];
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
  async addJournal(@Arg("data") data: AddJournalInput): Promise<Journal> {
    const journal = this.journalRepository.create();
    Object.assign(journal, data);
    return this.journalRepository.save(journal);
  }
}
