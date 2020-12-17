import { Field, InputType } from "type-graphql";

import { Journal } from "../../entity";

@InputType()
export class AddJournalInput implements Partial<Journal> {
  @Field()
  date!: Date

  @Field()
  title!: string

  @Field()
  body!: string
}
