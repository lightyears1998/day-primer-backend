import { Field, ObjectType } from "type-graphql";
import { Column } from "typeorm";

@ObjectType()
export class TimeSpan {
  @Field({ nullable: true })
  @Column({ nullable: true })
  start?: Date

  @Field({ nullable: true })
  @Column({ nullable: true })
  end?: Date

  @Field({ nullable: true })
  duration?: number
}
