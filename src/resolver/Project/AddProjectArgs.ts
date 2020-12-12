import { ArgsType, Field } from "type-graphql";

import { Project } from "../../entity";

@ArgsType()
export class AddProjectArgs implements Partial<Project> {
  @Field()
  name!: string;
}
