import { Mutation, Resolver } from "type-graphql";

import { ActionMutation } from "./Action/type";
import { JournalMutation } from "./Journal/type";
import { ProjectMutation } from "./Project/type";
import { UserMutation } from "./User/type";

@Resolver()
export class MutationResolver {
  @Mutation()
  action(): ActionMutation {
    return new ActionMutation();
  }

  @Mutation()
  journal(): JournalMutation {
    return new JournalMutation();
  }

  @Mutation()
  project(): ProjectMutation {
    return new ProjectMutation();
  }

  @Mutation()
  user(): UserMutation {
    return new UserMutation();
  }
}
