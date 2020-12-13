import {
  Field, ID, ObjectType
} from "type-graphql";
import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn
} from "typeorm";

import { Project } from "./Project";

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

  @Field()
  @Column({ nullable: true })
  plannedStart?: Date

  @Field()
  @Column({ nullable: true })
  plannedEnd?: Date

  @Field()
  @Column({ nullable: true })
  actualStart?: Date

  @Field()
  @Column({ nullable: true })
  actualEnd?: Date

  @Field()
  @CreateDateColumn()
  createdAt!: Date

  @Field()
  @CreateDateColumn()
  updatedAt!: Date
}
