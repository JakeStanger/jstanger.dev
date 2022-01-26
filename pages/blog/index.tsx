import React from "react";
import styles from "./Blog.module.scss";
import Layout from "../../components/layout/Layout";
import { GetStaticProps, NextPage } from "next";
import { admin } from "../../lib/firebase.server";
import IPost from "../../lib/schema/IPost";
import { DateTime } from "luxon";
import { firestore } from "firebase-admin";
import Timestamp = firestore.Timestamp;
import Link from "next/link";
import keywords from '../../lib/keywords';

interface Props {
  posts: IPost[];
}

const BlogHome: NextPage<Props> = ({ posts }) => {
  return (
    <Layout title={"Blog"}>
      <ul>
        {posts.map((post) => {
          const timestamp = DateTime.fromSeconds(post.createdAt);

          return (
            <li key={post.id} className={styles.postLink}>
              <Link href={`/blog/${post.id}--${keywords(post.title)}`}>
                <a>
                  <header className={styles.title}>{post.title}</header>
                  <div className={styles.description}>{post.description}</div>
                  <div
                    className={styles.timestamp}
                    title={timestamp.toFormat("dd/MM/yyyy hh:mm")}
                  >
                    {timestamp.toRelative()}
                  </div>
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const posts: IPost[] = await admin
    .firestore()
    .collection("posts")
    .where("published", "==", true)
    .orderBy('createdAt', 'desc')
    .get()
    .then((snapshots) =>
      snapshots.docs.map((doc) => {
        const data = doc.data();

        return {
          ...(data as IPost),
          id: doc.id,
          createdAt: (data.createdAt as Timestamp).seconds,
        };
      })
    );

  return {
    props: { posts },
    revalidate: 10, // In seconds
  };
};

export default BlogHome;
