import React from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import Layout from "../../../components/layout/Layout";
import "prismjs/themes/prism-dark.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import LoginForm, { useAuth } from "../../../components/loginForm/LoginForm";
import IPost, { RawPost } from "../../../lib/schema/IPost";
import { GetStaticPaths, GetStaticProps } from "next";
import { admin } from "../../../lib/firebase.server";
import { firestore } from "firebase-admin";
import Timestamp = firestore.Timestamp;
import PostEditor from "../../../components/editor/PostEditor";

interface Props {
  post: IPost;
}

const NewPost: React.FC<Props> = ({ post }) => {
  const [, loggedIn] = useAuth();

  if (!loggedIn) {
    return <LoginForm />;
  }

  return (
    <Layout title={`Edit post - ${post.title}`} maxWidth={1600}>
      <PostEditor post={post} />
    </Layout>
  );
};

export default NewPost;

export const getStaticProps: GetStaticProps = async (context) => {
  const id = (context.params?.id as string).split("--")[0];

  const post = await admin
    .firestore()
    .collection("posts")
    .doc(id)
    .get()
    .then((doc) => ({ ...(doc.data() as RawPost), id: doc.id }));

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    revalidate: 120,
    props: {
      post: {
        ...post,
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
    paths: posts.map((post) => `/blog/manage/${post.id}`),
    fallback: "blocking",
  };
};
