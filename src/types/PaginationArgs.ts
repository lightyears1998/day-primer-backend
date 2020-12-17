import {
  Field, InputType, Int
} from "type-graphql";

@InputType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  skip!: number

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  take!: number
}

export const defaultPaginationArgs = { skip: 0, take: 20 };
