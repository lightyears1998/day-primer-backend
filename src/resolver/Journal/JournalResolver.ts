import {
  Arg,
  Authorized,
  Mutation,
  Query, Resolver
} from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Journal } from "../../entity";
import { JournalRepository } from "../../repo/JournalRepository";

import { AddJournalInput } from "./param";

@Resolver(() => Journal)
export class JournalResolver {
  @InjectRepository()
  private readonly summaryRepository!: JournalRepository

  @Authorized()
  @Query(() => [Journal])
  async summariesOfToday(): Promise<Journal[]> {
    return this.summaryRepository.findByDay(new Date());
  }

  @Authorized()
  @Query(() => [Journal], { nullable: true })
  async summariesOf(@Arg("day") day: Date): Promise<Journal[]> {
    return this.summaryRepository.findByDay(new Date(day));
  }

  @Mutation(() => Journal)
  async addSummary(@Arg("data") data: AddJournalInput): Promise<Journal> {
    const summary = this.summaryRepository.create();
    Object.assign(summary, data);
    return this.summaryRepository.save(summary);
  }
}
