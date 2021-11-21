import React from "react";
import styles from "../Blog.module.scss";
import Layout from "../../../components/layout/Layout";
import { GetStaticProps, NextPage } from "next";
import { admin } from "../../../lib/firebase.server";
import IPost from "../../../lib/schema/IPost";
import { DateTime } from "luxon";
import { firestore } from "firebase-admin";
import Timestamp = firestore.Timestamp;
import Link from "next/link";
import LoginForm, { useAuth } from "../../../components/loginForm/LoginForm";

interface Props {
  posts: IPost[];
}

const BlogAdminHome: NextPage<Props> = ({ posts }) => {
  const [, loggedIn] = useAuth();

  if (!loggedIn) {
    return <LoginForm />;
  }

  return (
    <Layout title={"Blog [Admin]"}>
      <section>
        <Link href={'/blog/manage/new'}>
          <a data-style={'button'}>New post</a>
        </Link>
      </section>
      <main>
      <ul>
        {posts.map((post) => {
          const timestamp = DateTime.fromSeconds(post.createdAt);

          return (
            <li key={post.id} className={styles.postLink}>
              <Link href={`/blog/manage/${post.id}`}>
                <a>
                  <header className={styles.title}>{post.title}</header>
                  <div className={styles.description}>{post.description}</div>
                  <div
                    className={styles.timestamp}
                    title={timestamp.toFormat("dd/MM/yyyy hh:mm")}
                  >
                    {timestamp.toRelative()}
                  </div>
                  {!post.published && (
                    <div style={{ color: "#f2777a" }}>[Unpublished]</div>
                  )}
                  {post.published && (
                    <span style={{ color: "#99cc99" }}>[Published]</span>
                  )}
                  {}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
      </main>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const posts: IPost[] = await admin
    .firestore()
    .collection("posts")
    .orderBy("published", "asc")
    .orderBy("createdAt", "desc")
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
  };
};

export default BlogAdminHome;
