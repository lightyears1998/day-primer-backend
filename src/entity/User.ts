import {
  Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn
} from "typeorm";
import {
  Field, ID, ObjectType
} from "type-graphql";

@ObjectType()
@Entity()
@Unique("UNIQUE_username", ["username"])
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn("increment")
  userId!: number

  @Field()
  @Column()
  username!: string

  @Column()
  passwordHash!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
