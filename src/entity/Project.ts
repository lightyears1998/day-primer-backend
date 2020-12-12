import { Field, ObjectType } from "type-graphql";
import {
  Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

import { Action } from "./Action";
import { User } from "./User";

@ObjectType()
@Entity()
export class Project {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  projectId!: string

  @Field(() => User)
  @ManyToOne(() => User, user => user.projects)
  owner?: User

  @Field()
  @Column()
  name!: string

  @Field()
  @Column({ default: "" })
  description!: string

  @Field(() => [Action])
  @OneToMany(() => Action, action => action.project)
  actions?: Action[]

  @Field()
  @CreateDateColumn()
  createdAt!: Date

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date
}
