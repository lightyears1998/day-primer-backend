import { Field, InputType } from "type-graphql";

import { Journal } from "../../../entity";

@InputType()
export class UpdateJournalInput implements Partial<Journal> {
  @Field({ nullable: true })
  date!: Date

  @Field({ nullable: true })
  title!: string

  @Field({ nullable: true })
  body!: string
}
