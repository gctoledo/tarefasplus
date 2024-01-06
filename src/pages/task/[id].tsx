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
} from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

import TextArea from "@/components/textarea";

interface TaskProps {
  task: {
    id: string;
    created: Date;
    public: boolean;
    task: string;
    user: string;
  };
}

const Task = ({ task }: TaskProps) => {
  const { data: session } = useSession();

  const [input, setInput] = useState("");

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
        taskId: task.id,
      });

      setInput("");
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
    </div>
  );
};

export default Task;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;

  const docRef = doc(db, "tasks", id);

  const snapshot = await getDoc(docRef);

  if (snapshot.data() === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!snapshot.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const miliseconds = snapshot.data()?.created?.seconds * 1000;

  const task = {
    task: snapshot.data()?.task,
    public: snapshot.data()?.public,
    created: new Date(miliseconds).toLocaleDateString(),
    user: snapshot.data()?.user,
    id: id,
  };

  return {
    props: {
      task,
    },
  };
};
