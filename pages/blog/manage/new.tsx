import React from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import Layout from "../../../components/layout/Layout";
import "prismjs/themes/prism-dark.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import LoginForm, { useAuth } from "../../../components/loginForm/LoginForm";
import PostEditor from "../../../components/editor/PostEditor";

const NewPost: React.FC = () => {
  const [, loggedIn] = useAuth();
  if (!loggedIn) {
    return <LoginForm />;
  }

  return (
    <Layout title={"New post"} maxWidth={1600}>
      <PostEditor />
    </Layout>
  );
};

export default NewPost;
