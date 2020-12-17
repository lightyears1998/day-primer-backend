import { Field, InputType } from "type-graphql";

import { Project } from "../../entity";

@InputType()
export class AddProjectInput implements Partial<Project> {
  @Field()
  name!: string;
}
