import {
  Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn
} from "typeorm";
import {
  Field, ID, ObjectType
} from "type-graphql";

import { Project } from "./Project";
import { Journal } from "./Journal";

@ObjectType()
@Entity()
@Unique("UNIQUE_username", ["username"])
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  userId!: number

  @Field()
  @Column()
  username!: string

  @Column()
  passwordHash!: string

  @Field(() => [Journal])
  @OneToMany(() => Journal, journal => journal.owner)
  journals?: Journal[]

  @Field(() => [Project])
  @OneToMany(() => Project, project => project.owner)
  projects?: Project[]

  @Field(() => Date)
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt!: Date
}
