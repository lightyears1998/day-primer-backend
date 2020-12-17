import { Field, InputType } from "type-graphql";

import { Project } from "../../entity";

@InputType()
export class UpdateProjectInput implements Partial<Project> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;
}
