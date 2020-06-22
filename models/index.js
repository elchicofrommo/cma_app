// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Blog, Post, Comment, AuthDetail, Preferences, Meetings, GratitudeComment, GratitudeLike, GratitudeEntry, Gratitude } = initSchema(schema);

export {
  Blog,
  Post,
  Comment,
  AuthDetail,
  Preferences,
  Meetings,
  GratitudeComment,
  GratitudeLike,
  GratitudeEntry,
  Gratitude
};