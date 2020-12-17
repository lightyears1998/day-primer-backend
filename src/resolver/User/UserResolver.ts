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
import { QueryUsersResult } from "../../types/User";

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
  async existUsername(username: string): Promise<boolean> {
    return (await this.userRepository.findByUsername(username)) !== undefined;
  }

  @Mutation(() => User)
  async signUp(
    @Arg("username") username: string,
    @Arg("password") password: string
  ): Promise<User> {
    return this.userService.registerUser(username, password);
  }

  @Mutation(() => User, { nullable: true })
  async signIn(@Arg("username") username: string, @Arg("password") password: string, @Ctx() ctx: AppContext): Promise<User | null> {
    const user = await this.userRepository.findOneOrFail({ username });

    if (!(await this.userService.matchPassword(user, password))) {
      throw new ApolloError("用户名或密码错误。", "WRONG_USERNAME_OR_PASSWORD");
    }

    if (ctx.session) {
      ctx.session.userId = user.userId;
    }
    return user;
  }

  @Mutation(() => Boolean)
  async signOut(@Ctx() ctx: AppContext): Promise<boolean> {
    ctx.session = null;
    return true;
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

  @Authorized()
  @Mutation(() => Boolean)
  async updatePassword(
    @Ctx() ctx: AppUserContext,
    @Arg("newPassword") newPassword: string,
    @Arg("oldPassword") oldPassword: string
  ): Promise<boolean> {
    const user = ctx.getSessionUser() as User;
    if (!(await this.userService.matchPassword(user, oldPassword))) {
      throw new ApolloError("旧密码错误。");
    }

    await this.userService.updatePassword(user, newPassword);
    return true;
  }
}
