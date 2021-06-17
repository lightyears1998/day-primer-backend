import {
  Field, Int, ObjectType
} from "type-graphql";

import { User } from "../../../entity";

@ObjectType()
export class QueryUsersResult {
  @Field(() => [User])
  users!: User[]

  @Field(() => Int)
  total!: number

  @Field()
  hasMore!: boolean
}
