import os from "os";

import {
  FieldResolver, Query, Resolver, ResolverInterface
} from "type-graphql";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Server, ServerAnnouncement } from "../../entity";

@Service()
@Resolver(() => Server)
export class ServerResolver implements ResolverInterface<Server> {
  // @InjectRepository(ServerAnnouncement)
  // announcementRepository!: Repository<ServerAnnouncement>

  // @FieldResolver()
  // async loadAveragePerCpu(): Promise<number[]> {
  //   const cpuCount = os.cpus().length;
  //   return os.loadavg().map(load => load / cpuCount);
  // }

  // @FieldResolver()
  // async latestAnnouncement(): Promise<ServerAnnouncement | undefined> {
  //   return this.announcementRepository.findOne({ order: { updatedAt: "DESC" } });
  // }

  // @FieldResolver()
  // async announcements(): Promise<ServerAnnouncement[]> {
  //   return this.announcementRepository.find({ relations: ["by"], order: { updatedAt: "DESC" } });
  // }

  // @Query(() => Server)
  // async server(): Promise<Server> {
  //   return new Server();
  // }
}
