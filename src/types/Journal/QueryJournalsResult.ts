import { ObjectType } from "type-graphql";

import { Journal } from "../../entity";
import PaginatedResponse from "../PaginatedResponse";

@ObjectType()
export class PaginatedJournalResponse extends PaginatedResponse(Journal) {}
