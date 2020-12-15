import {
  Field, ID, ObjectType
} from "type-graphql";
import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn
} from "typeorm";

import { Project } from "./Project";
import { TimeSpan } from "./TimeSpan";

@ObjectType()
@Entity()
export class Action {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  actionId!: string

  @Field(() => Project)
  @ManyToOne(() => Project, project => project.actions)
  project?: Project

  @Field()
  @Column()
  name!: string

  @Field()
  @Column({ default: "" })
  description!: string

  @Field()
  @Column({ default: false })
  isDone!: boolean

  @Field(() => TimeSpan)
  @Column(() => TimeSpan)
  planned!: TimeSpan

  @Field(() => TimeSpan)
  @Column(() => TimeSpan)
  actual!: TimeSpan

  @Field()
  @CreateDateColumn()
  createdAt!: Date

  @Field()
  @CreateDateColumn()
  updatedAt!: Date
}
