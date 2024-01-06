import { ChangeEvent, FormEvent, useState } from "react";

import { useSession } from "next-auth/react";

import { GetServerSideProps } from "next";

import Head from "next/head";

import styles from "./styles.module.css";

import {
  doc,
  collection,
  query,
  where,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

import TextArea from "@/components/textarea";

import { FaTrash } from "react-icons/fa";

interface TaskProps {
  task: {
    id: string;
    created: Date;
    public: boolean;
    task: string;
    user: string;
  };
  allComments: CommentsProps[];
}

interface CommentsProps {
  id: string;
  comment: string;
  taskId: string;
  user: string;
  name: string;
}

const Task = ({ task, allComments }: TaskProps) => {
  const { data: session } = useSession();

  const [input, setInput] = useState("");
  const [comments, setComments] = useState<CommentsProps[]>(allComments || []);

  const handleComment = async (e: FormEvent) => {
    e.preventDefault();

    if (input === "") return;

    if (!session?.user?.email || !session?.user?.name) return;

    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: task?.id,
      });

      const data = {
        id: docRef.id,
        comment: input,
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: task?.id,
      };

      setComments((oldItems) => [...oldItems, data]);
      setInput("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      const docRef = doc(db, "comments", id);
      await deleteDoc(docRef);

      const deleteComment = comments.filter((comment) => comment.id !== id);

      setComments(deleteComment);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Detalhes da tarefa</title>
      </Head>

      <main className={styles.main}>
        <h1>Tarefa</h1>

        <article className={styles.task}>
          <p>{task?.task}</p>
        </article>
      </main>

      <section className={styles.commentsContainer}>
        <h2>Deixar comentário</h2>
        <form onSubmit={handleComment}>
          <TextArea
            placeholder="Digite o seu comentário"
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setInput(e.target.value)
            }
          />
          <button className={styles.button} disabled={!session?.user}>
            Enviar comentário
          </button>
        </form>
      </section>

      <section className={styles.commentsContainer}>
        <h2>Todos os comentários</h2>
        {comments.length === 0 && <span>Nenhum comentário encontrado</span>}

        {comments.map((comment) => (
          <article className={styles.comment} key={comment.id}>
            <div className={styles.headComment}>
              <label className={styles.commentLabel}>{comment.name}</label>

              {comment.user === session?.user?.email && (
                <button
                  className={styles.buttonTrash}
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <FaTrash color="#ea3140" size={18} />
                </button>
              )}
            </div>

            <p>{comment.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Task;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;

  const docRef = doc(db, "tasks", id);
  const snapshotTask = await getDoc(docRef);

  const q = query(collection(db, "comments"), where("taskId", "==", id));
  const snapshotComments = await getDocs(q);

  const allComments = [] as CommentsProps[];

  snapshotComments.forEach((doc) => {
    allComments.push({
      id: doc.id,
      comment: doc.data().comment,
      user: doc.data().user,
      name: doc.data().name,
      taskId: doc.data().taskId,
    });
  });

  if (snapshotTask.data() === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!snapshotTask.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const miliseconds = snapshotTask.data()?.created?.seconds * 1000;

  const task = {
    task: snapshotTask.data()?.task,
    public: snapshotTask.data()?.public,
    created: new Date(miliseconds).toLocaleDateString(),
    user: snapshotTask.data()?.user,
    id: id,
  };

  return {
    props: {
      task,
      allComments,
    },
  };
};
