import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Blog {
  readonly id: string;
  readonly name: string;
  readonly posts?: Post[];
  constructor(init: ModelInit<Blog>);
  static copyOf(source: Blog, mutator: (draft: MutableModel<Blog>) => MutableModel<Blog> | void): Blog;
}

export declare class Post {
  readonly id: string;
  readonly title: string;
  readonly blog?: Blog;
  readonly comments?: Comment[];
  constructor(init: ModelInit<Post>);
  static copyOf(source: Post, mutator: (draft: MutableModel<Post>) => MutableModel<Post> | void): Post;
}

export declare class Comment {
  readonly id: string;
  readonly post?: Post;
  readonly content: string;
  constructor(init: ModelInit<Comment>);
  static copyOf(source: Comment, mutator: (draft: MutableModel<Comment>) => MutableModel<Comment> | void): Comment;
}

export declare class AuthDetail {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly username: string;
  constructor(init: ModelInit<AuthDetail>);
  static copyOf(source: AuthDetail, mutator: (draft: MutableModel<AuthDetail>) => MutableModel<AuthDetail> | void): AuthDetail;
}

export declare class Preferences {
  readonly id: string;
  readonly email: string;
  readonly screenName: string;
  readonly name: string;
  readonly soberietyDate: string;
  constructor(init: ModelInit<Preferences>);
  static copyOf(source: Preferences, mutator: (draft: MutableModel<Preferences>) => MutableModel<Preferences> | void): Preferences;
}

export declare class Meetings {
  readonly id: string;
  readonly email: string;
  readonly meetings: string[];
  constructor(init: ModelInit<Meetings>);
  static copyOf(source: Meetings, mutator: (draft: MutableModel<Meetings>) => MutableModel<Meetings> | void): Meetings;
}