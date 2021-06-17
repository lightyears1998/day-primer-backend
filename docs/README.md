# 开发者文档

- 代码注释和文档、Git log 使用中文。
- Git log 使用 cz-conventional-changelog 风格。

## 技术框架

- koa.js
- apollo graphql server
- typegraphql
- typeorm

### 数据库的对比

项目中采用 PostgreSQL。

- Sqlite 是个轻量级的数据库，但它不支持本项目大量依赖的日期操作的比较操作。

## Apollo GraphQL Playground

使用 Cookies 时，需要设置 `"request.credentials": "include"`。

## VS Code 插件

在本项目的开发过程中使用了以下 VS Code 插件：

| 插件 ID | 功能 | 配置文件 |
| --- | --- | --- |
| dbaeumer.vscode-eslint | ESLint 插件 | eslintrc.yml |
| streetSideSoftware.code-spell-checker | 拼写检查 | cspell.json |

推荐的 VS Code 设置如下：

``` json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 设计风格

DDD = Domain-Driven Design

1. 尽管直接操作 DO 不是最佳实践；但是项目的复杂度不高，不需要细致地分层。

## 编程风格

以下规则大部分改编自[graphql-rules.com](https://graphql-rules.com)。

### GraphQL 编程风格

#### Input 风格

``` graphql
# Colocate related fields in custom types
type Query {
  articles(filter: ArticleFilter, limit: Int): [Article]
}

input ArticleFilter {
  lang: String
  userId: Int
  rating: MinMaxInput
}

input MinMaxInput {
  min: Int
  max: Int
}
```

#### List 风格

``` graphql
type Query {
  articles(filter: ArticleFilter): [Article]
  articles(sort: [ArticleSort!]): [Article]
  articles(limit: Int! = 20, skip: Int): [Article]
  articles(page: Int! = 1, perPage: Int! = 20): ArticlePagination
}

enum ArticleSort {
  ID_ASC
  ID_DESC
  TEXT_MATCH
  CLOSEST
}

type PaginationInfo {
  totalPages: Int!
  totalItems: Int!
  page: Int!
  perPage: Int!
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}

type ArticlePagination {
  items: [Article]!
  pageInfo: PaginationInfo!
}
```

#### Mutation 风格

``` graphql
# Think out of the CRUD box - create small mutations for different business operations against the resources.
type ArticleMutations {
  # Not so good
  create(...): Payload
  update(...): Payload

  # Cool
  like(...): Payload
  unlike(...): Payload
  publish(...): Payload
  unpublish(...): Payload
}

# Consider the ability to perform mutations on multiple items (same type batch changes).
type ArticleMutations {
-  deleteArticle(id: Int!): Payload
+  deleteArticle(id: [Int!]!): Payload
}

mutation DeleteArticles {
  # BAD
  op1: deleteArticle(id: 1)
  op2: deleteArticle(id: 2)
  op3: deleteArticle(id: 5)
  op4: deleteArticle(id: 5)
}

# Mutations should clearly describe all the mandatory arguments, there should be no options either-either.
type Mutation {
-  sendResetPassword(login: String, email: Email)
+  sendResetPasswordByLogin(login: String!)  # login NonNull
+  sendResetPasswordByEmail(email: Email!)   # email NonNull
}

# In mutations, put all variables into one unique input argument.
# Good:
mutation ($input: UpdatePostInput!) {
  updatePost(input: $input) { ... }
}

# Not so good – it's harder to write a query (duplication of variables)
mutation ($id: ID!, $newText: String, ...) {
  updatePost(id: $id, newText: $newText, ...) { ... }
}

# Every mutation should have a unique payload type.
type Mutation {
-  createPerson(input: ...): Person               # BAD
+  createPerson(input: ...): CreatePersonPayload  # GOOD
}

+ type CreatePersonPayload {
+   recordId: ID
+   record: Person
+   # ... any other fields you like
+ }

# In the mutation response, return the modified resource and its id.
type CreatePersonPayload {
+  recordId: ID
+  record: Person
  # ...  any other fields you like
}
```

#### 备选风格

``` graphql
# Return operation status as part of mutation response.
type CreatePersonPayload {
  record: Person
+ status: CreatePersonStatus! # fail, success, etc. Or 201, 403, 404 etc.
  # ... any other fields you like
}

# In the mutation response, return a field of type Query.
type Mutation {
  likePost(id: 1): LikePostPayload
}

type LikePostPayload {
  record: Post

+ query: Query
}

# In the mutation response, return the errors field with typed user errors.
type Mutation {
  likePost(id: 1): LikePostPayload
}

type LikePostPayload {
  record: Post

+ errors: [LikePostProblems!]
}

interface ProblemInterface {
  message: String!
}

type AccessRightProblem implements ProblemInterface {
  message: String!
}

type SpikeProtectionProblem implements ProblemInterface {
  message: String!
  # Timout in seconds when the next operation will be executed without errors
  wait: Int!
}

type PostDoesNotExistsProblem implements ProblemInterface {
  message: String!
  postId: Int!
}

type Mutation {
  likePost(id: Int!): LikePostPayload
}

union LikePostProblems = SpikeProtectionProblem | PostDoesNotExistsProblem;

type LikePostPayload {
  recordId: Int
  # `record` is nullable! If there is an error we may return null for Post
  record: Post
  errors: [LikePostProblems!]
}
```
