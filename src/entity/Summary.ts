import {
  Field, ID, ObjectType
} from "type-graphql";
import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

@ObjectType()
@Entity()
export class Summary {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  summaryId!: number

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
