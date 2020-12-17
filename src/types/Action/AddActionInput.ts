import { Field, InputType } from "type-graphql";

import { Action } from "../../entity";

@InputType()
export class AddActionInput implements Partial<Action> {
  @Field()
  name!: string

  @Field({ nullable: true, defaultValue: "" })
  description!: string

  @Field({ nullable: true })
  plannedStart?: Date

  @Field({ nullable: true })
  plannedEnd?: Date

  @Field({ nullable: true })
  actualStart?: Date

  @Field({ nullable: true })
  actualEnd?: Date
}
