import {
  Query, Resolver, Ctx, Mutation, Arg, Int, Authorized, FieldResolver, ResolverInterface, Root
} from "type-graphql";
import { Inject, Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloError } from "apollo-server";

import { User } from "../../entity";
import { AppContext, AppUserContext } from "../../context";
import { UserRepository } from "../../repo";
import { Project } from "../../entity/Project";
import { UserService } from "../../service";

import { QueryUsersResult } from "./type";

@Service()
@Resolver(() => User)
export class UserResolver implements ResolverInterface<User> {
  @InjectRepository()
  private readonly userRepository!: UserRepository

  @Inject()
  private readonly userService!: UserService

  @FieldResolver(() => [Project])
  async projects(
    @Root() user: User
  ): Promise<Project[]> {
    if (!user.projects) {
      user.projects = await this.userRepository.loadProjects(user);
    }

    return user.projects;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: AppUserContext): Promise<User | undefined> {
    return ctx.getSessionUser();
  }

  @Query(() => Boolean)
  async existUsername(@Arg("username") username: string): Promise<boolean> {
    return (await this.userRepository.findByUsername(username)) !== undefined;
  }

  @Authorized()
  @Query(() => QueryUsersResult, {
    complexity: ({ args, childComplexity }) => {
      return 1 + childComplexity * (args.take ?? 0);
    }
  })
  async users(
    @Arg("skip", () => Int, { nullable: true, defaultValue: 0 }) skip: number,
    @Arg("take", () => Int, { nullable: true, defaultValue: 20 }) take: number
  ): Promise<QueryUsersResult> {
    const users = await this.userRepository.find({ skip, take });
    const total = await this.userRepository.count();
    const hasMore = skip + take < total;

    return {
      users, total, hasMore
    };
  }
}
