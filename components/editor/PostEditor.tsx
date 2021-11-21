import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./PostEditor.module.scss";
import IEditorProps from "./IEditorProps";
import type { Editor } from "@toast-ui/react-editor";
import Prism from "prismjs";
import IPost from "../../lib/schema/IPost";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useRouter } from "next/router";
import Dialog from "../dialog/Dialog";

function getKey(post: IPost | undefined) {
  if (post) {
    return `editor.draft.${post.id}`;
  } else {
    return "editor.draft";
  }
}

const PostEditor: React.FC<IEditorProps> = ({ post }) => {
  const router = useRouter();

  const editorRef = useRef<Editor>(null);

  const [EditorModule, setEditorModule] =
    useState<{ Editor: typeof Editor; codeSyntaxHighlight: any }>();
  const [editorValue, setEditorValue] = useState("");

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const [deleting, setDeleting] = useState(false);

  /** dynamically imports editor as it doesn't support ssr */
  useEffect(() => {
    Promise.all([
      import("@toast-ui/react-editor"),
      import(
        // @ts-ignore no types in /dist
        "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all"
      ),
    ]).then(([{ Editor }, { default: codeSyntaxHighlight }]) => {
      setEditorModule({ Editor, codeSyntaxHighlight });
    });
  }, []);

  /** loads post or saved value */
  useEffect(() => {
    const savedValue = localStorage.getItem(getKey(post)) ?? post?.body ?? "";
    setEditorValue(savedValue);
    editorRef.current?.getInstance().setMarkdown(savedValue);

    setTitle(post?.title || "");
    setDesc(post?.description || "");
  }, [post, post?.body]);

  const onSave = useCallback(
    (published: boolean) => async () => {
      const posts = collection(db, "posts");
      const post = await addDoc(posts, {
        title,
        description: desc,
        body: editorValue,
        createdAt: new Date(),
        published,
      });

      localStorage.removeItem(getKey(undefined));
      await router.push(`/blog/${post.id}`);
    },
    [desc, editorValue, router, title]
  );

  const onUpdate = useCallback(async () => {
    if (!post) {
      return;
    }

    const ref = doc(db, "posts", post.id);
    await updateDoc(ref, {
      title,
      description: desc,
      body: editorValue,
    });

    if (post.published) {
      await router.push(`/blog/${post.id}`);
    } else {
      await router.reload();
    }
  }, [desc, editorValue, post, router, title]);

  const onSetPublished = useCallback(
    (published: boolean) => async () => {
      if (!post) {
        return;
      }

      const ref = doc(db, "posts", post.id);
      await updateDoc(ref, {
        published,
      });

      if (published) {
        await router.push(`/blog/${post.id}`);
      } else {
        await router.reload();
      }
    },
    [post, router]
  );

  const onDelete = useCallback(async () => {
    if (!post) {
      return;
    }

    const ref = doc(db, "posts", post.id);
    await deleteDoc(ref);

    localStorage.removeItem(getKey(post));
    await router.push(`/blog/manage`);
  }, [post, router]);

  const onChange = useCallback(() => {
    const newVal = editorRef.current?.getInstance().getMarkdown();
    if (newVal !== undefined) {
      setEditorValue(newVal);
      localStorage.setItem(getKey(post), newVal);
    }
  }, [post]);

  const onTitleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(ev.target.value);
    },
    []
  );

  const onDescChange = useCallback(
    (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDesc(ev.target.value);
    },
    []
  );

  const toggleDeleteDialog = useCallback(
    (newState: boolean) => () => {
      setDeleting(newState);
    },
    []
  );

  if (!EditorModule) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <main>
        <EditorModule.Editor
          ref={editorRef}
          previewStyle={"vertical"}
          previewHighlight={false}
          theme={"dark"}
          height={"calc(100vh - 280px)"}
          initialValue={editorValue}
          onChange={onChange}
          plugins={[[EditorModule.codeSyntaxHighlight, { highlighter: Prism }]]}
        />
      </main>
      <section className={styles.meta}>
        <label htmlFor={"title"}>Post Title</label>
        <input name={"title"} value={title} onChange={onTitleChange} />

        <label htmlFor={"desc"}>Description</label>
        <textarea rows={3} name={"desc"} value={desc} onChange={onDescChange} />
      </section>
      <section className={styles.buttons}>
        {post && (
          <>
            <button onClick={onUpdate}>Save</button>
            <button onClick={onSetPublished(!post.published)}>
              {post.published ? "Unpublish" : "Publish"}
            </button>
            <button onClick={toggleDeleteDialog(true)}>Delete</button>
          </>
        )}
        {!post && (
          <>
            <button onClick={onSave(false)}>Save draft</button>
            <button onClick={onSave(true)}>Publish</button>
          </>
        )}
      </section>
      <Dialog
        title={"Delete post?"}
        isOpen={deleting}
        onDismiss={toggleDeleteDialog(false)}
      >
        <button data-button-style={"secondary"} onClick={onDelete}>
          Confirm
        </button>
      </Dialog>
    </>
  );
};

export default PostEditor;
