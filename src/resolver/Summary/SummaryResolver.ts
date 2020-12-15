import {
  Arg,
  Authorized,
  Mutation,
  Query, Resolver
} from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Summary } from "../../entity";
import { SummaryRepository } from "../../repo/SummaryRepository";

import { AddSummaryInput } from "./param";

@Resolver(() => Summary)
export class SummaryResolver {
  @InjectRepository()
  private readonly summaryRepository!: SummaryRepository

  @Authorized()
  @Query(() => [Summary])
  async summariesOfToday(): Promise<Summary[]> {
    return this.summaryRepository.findByDay(new Date());
  }

  @Authorized()
  @Query(() => [Summary], { nullable: true })
  async summariesOf(@Arg("day") day: Date): Promise<Summary[]> {
    return this.summaryRepository.findByDay(new Date(day));
  }

  @Mutation(() => Summary)
  async addSummary(@Arg("data") data: AddSummaryInput): Promise<Summary> {
    const summary = this.summaryRepository.create();
    Object.assign(summary, data);
    return this.summaryRepository.save(summary);
  }
}
