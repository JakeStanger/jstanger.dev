import { firestore } from 'firebase-admin';
import Timestamp = firestore.Timestamp;

interface IPost {
  id: string;
  title: string;
  description: string;
  body: string;
  createdAt: number;
  published: boolean;
}

export default IPost;

export type RawPost = Omit<IPost, 'createdAt'> & {createdAt: Timestamp};