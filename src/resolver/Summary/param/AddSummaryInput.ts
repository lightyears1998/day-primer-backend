import { Field, InputType } from "type-graphql";

import { Summary } from "../../../entity";

@InputType()
export class AddSummaryInput implements Partial<Summary> {
  @Field()
  date!: Date

  @Field()
  title!: string

  @Field()
  body!: string
}
