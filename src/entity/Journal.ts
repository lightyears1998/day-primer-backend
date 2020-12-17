import {
  Field, ID, ObjectType
} from "type-graphql";
import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

import { User } from "./User";

@ObjectType()
@Entity()
export class Journal {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  journalId!: string

  @Field(() => User)
  @ManyToOne(() => User, user => user.journals)
  owner?: User

  @Field()
  @Column()
  date!: Date

  @Field()
  @Column()
  title!: string

  @Field()
  @Column()
  body!: string

  @Field()
  @CreateDateColumn()
  createdAt!: Date

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date
}
