import { ArgsType, Field } from "type-graphql";

import { Project } from "../../entity";

@ArgsType()
export class UpdateProjectArgs implements Partial<Project> {
  @Field()
  projectId!: string

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;
}
