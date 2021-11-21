import React from "react";
import styles from "./Blog.module.scss";
import Layout from "../../components/layout/Layout";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { admin } from "../../lib/firebase.server";
import IPost, { RawPost } from '../../lib/schema/IPost';
import { DateTime } from "luxon";
import { firestore } from "firebase-admin";
import Timestamp = firestore.Timestamp;
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import "highlight.js/styles/base16/eighties.css";
import keywords from "../../lib/keywords";
import readingTime from "reading-time";
import { useAuth } from "../../components/loginForm/LoginForm";
import Link from "next/link";

interface Props {
  post: IPost;
}

const BlogPost: NextPage<Props> = ({ post }) => {
  const [auth, loggedIn] = useAuth();

  const time = readingTime(`${post.body}`);

  return (
    <Layout title={post.title}>
      <div className={styles.info}>
        <div
          title={DateTime.fromSeconds(post.createdAt).toFormat(
            "dd/MM/yyyy hh:mm"
          )}
        >
          {DateTime.fromSeconds(post.createdAt).toRelative()}
        </div>
        <div title={`about ${Math.round(time.words / 10) * 10} words`}>
          {time.text}
        </div>
      </div>
      <main
        className={styles.post}
        dangerouslySetInnerHTML={{ __html: post.body }}
      ></main>
      {loggedIn && (
        <section className={styles.adminButtons}>
          <Link href={`/blog/manage/${post.id}`}>
            <a data-style={'button'}>Manage</a>
          </Link>
        </section>
      )}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = (context.params?.id as string).split("--")[0];

  const post = await admin
    .firestore()
    .collection("posts")
    .doc(id)
    .get()
    .then((doc) => ({...doc.data() as RawPost, id: doc.id}));

  if (!post) {
    return {
      notFound: true,
    };
  }

  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify);

  const html = processor.processSync(post.body).value;

  return {
    revalidate: 120,
    props: {
      post: {
        ...post,
        body: html,
        createdAt: (post.createdAt as Timestamp).seconds,
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const posts = await admin
    .firestore()
    .collection("posts")
    .where("published", "==", true)
    .get()
    .then((snapshots) =>
      snapshots.docs.map((doc) => ({ id: doc.id, title: doc.data().title }))
    );

  return {
    paths: posts.map((post) => `/blog/${post.id}--${keywords(post.title)}`),
    fallback: "blocking",
  };
};

export default BlogPost;
