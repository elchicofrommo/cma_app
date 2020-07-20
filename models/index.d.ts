import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";



export declare class AuthDetail {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  constructor(init: ModelInit<AuthDetail>);
  static copyOf(source: AuthDetail, mutator: (draft: MutableModel<AuthDetail>) => MutableModel<AuthDetail> | void): AuthDetail;
}

export declare class Preferences {
  id: string;
   email: string;
   name: string;
   userId: string;
   soberietyDate: string;
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
  readonly entry?: GratitudeEntry;
  readonly gratitude?: Gratitude;
  constructor(init: ModelInit<GratitudeComment>);
  static copyOf(source: GratitudeComment, mutator: (draft: MutableModel<GratitudeComment>) => MutableModel<GratitudeComment> | void): GratitudeComment;
}

export declare class GratitudeEntry {
  readonly id: string;
  readonly index: number;
  readonly content: string;
  readonly gratitude?: Gratitude;
  readonly likes?: GratitudeLike[];
  readonly comments?: GratitudeComment[];
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

export declare class GratitudeLike {
  readonly id: string;
  readonly user: string;
  readonly created: number;
  readonly entry?: GratitudeEntry;
  readonly gratitude?: Gratitude;
  constructor(init: ModelInit<GratitudeLike>);
  static copyOf(source: GratitudeLike, mutator: (draft: MutableModel<GratitudeLike>) => MutableModel<GratitudeLike> | void): GratitudeLike;
}
export declare class DailyReaders {
  readonly id: string;
  readonly readings: string;
  constructor(init: ModelInit<DailyReaders>);
  static copyOf(source: DailyReaders, mutator: (draft: MutableModel<DailyReaders>) => MutableModel<DailyReaders> | void): DailyReaders;

}
export declare class Person {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly address?: Address[];
  constructor(init: ModelInit<Person>);
  static copyOf(source: Person, mutator: (draft: MutableModel<Person>) => MutableModel<Person> | void): Person;
}

export declare class Address {
  readonly id: string;
  readonly street: string;
  readonly city: string;
  readonly state: string;
  readonly person?: Person;
  constructor(init: ModelInit<Address>);
  static copyOf(source: Address, mutator: (draft: MutableModel<Address>) => MutableModel<Address> | void): Address;
}