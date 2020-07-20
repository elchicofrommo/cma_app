// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const {  AuthDetail, Preferences, Meetings, GratitudeComment, GratitudeEntry, Gratitude, GratitudeLike, Person, Address, DailyReaders } = initSchema(schema);

export {

  DailyReaders,
  AuthDetail,
  Preferences,
  Meetings,
  GratitudeComment,
  GratitudeEntry,
  Gratitude,
  GratitudeLike,
  Person,
  Address
};