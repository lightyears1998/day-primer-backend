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

import { QueryUsersResult, UserMutation } from "./type";

@Service()
@Resolver(() => UserMutation)
export class UserMutationResolver {
  @InjectRepository()
  private readonly userRepository!: UserRepository

  @Inject()
  private readonly userService!: UserService

  @FieldResolver(() => User)
  async signUp(
    @Arg("username") username: string,
    @Arg("password") password: string
  ): Promise<User> {
    return this.userService.registerUser(username, password);
  }

  @FieldResolver(() => User, { nullable: true })
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

  @Authorized()
  @FieldResolver(() => Boolean)
  async signOut(@Ctx() ctx: AppContext): Promise<boolean> {
    ctx.session = null;
    return true;
  }

  @Authorized()
  @FieldResolver(() => Boolean)
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
