import { Field, InputType } from "type-graphql";

import { Action } from "../../entity";

@InputType()
export class UpdateActionInput implements Partial<Action> {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  isDone?: boolean

  @Field({ nullable: true })
  plannedStart?: Date

  @Field({ nullable: true })
  plannedEnd?: Date

  @Field({ nullable: true })
  actualStart?: Date

  @Field({ nullable: true })
  actualEnd?: Date
}
