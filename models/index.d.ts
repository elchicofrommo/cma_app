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

export declare class GratitudeComment {
  readonly id: string;
  readonly user: string;
  readonly text: string;
  readonly created: number;
  readonly gratitudeEntryCommentsId?: string;
  readonly gratitudeCommentsId?: string;
  constructor(init: ModelInit<GratitudeComment>);
  static copyOf(source: GratitudeComment, mutator: (draft: MutableModel<GratitudeComment>) => MutableModel<GratitudeComment> | void): GratitudeComment;
}

export declare class GratitudeLike {
  readonly id: string;
  readonly user: string;
  readonly created: number;
  readonly gratitudeEntryLikesId?: string;
  readonly gratitudeLikesId?: string;
  constructor(init: ModelInit<GratitudeLike>);
  static copyOf(source: GratitudeLike, mutator: (draft: MutableModel<GratitudeLike>) => MutableModel<GratitudeLike> | void): GratitudeLike;
}

export declare class GratitudeEntry {
  readonly id: string;
  readonly index: number;
  readonly content: string;
  readonly likes?: GratitudeLike[];
  readonly comments?: GratitudeComment[];
  readonly gratitudeEntriesId?: string;
  constructor(init: ModelInit<GratitudeEntry>);
  static copyOf(source: GratitudeEntry, mutator: (draft: MutableModel<GratitudeEntry>) => MutableModel<GratitudeEntry> | void): GratitudeEntry;
}

export declare class Gratitude {
  readonly id: string;
  readonly email: string;
  readonly title: string;
  readonly time: number;
  readonly entries?: GratitudeEntry[];
  readonly comments?: GratitudeComment[];
  readonly likes?: GratitudeLike[];
  constructor(init: ModelInit<Gratitude>);
  static copyOf(source: Gratitude, mutator: (draft: MutableModel<Gratitude>) => MutableModel<Gratitude> | void): Gratitude;
}