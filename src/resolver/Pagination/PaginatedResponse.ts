import {
  ClassType, Field, Int, ObjectType
} from "type-graphql";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function PaginatedResponse<TNode>(TNodeClass: ClassType<TNode>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(() => [TNodeClass])
    nodes!: TNode[];

    @Field(() => Int)
    skip!: number;

    @Field(() => Int)
    take!: number;

    @Field(() => Int)
    total!: number;

    @Field()
    hasMore!: boolean;

    constructor(nodes: TNode[], skip: number, take: number, total: number) {
      this.nodes = nodes;
      this.skip = skip;
      this.take = take;
      this.total = total;
      this.hasMore = this.skip + this.take < this.total;
    }
  }
  return PaginatedResponseClass;
}
