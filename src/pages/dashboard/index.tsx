import { ChangeEvent, FormEvent, useState } from "react";

import { GetServerSideProps } from "next";

import Head from "next/head";

import { getSession } from "next-auth/react";

import styles from "./styles.module.css";

import TextArea from "@/components/textarea";

import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";

import { addDoc, collection } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

interface DashboardProps {
  user: {
    email: string;
  };
}

const Dashboard = ({ user }: DashboardProps) => {
  const [input, setInput] = useState("");
  const [publicTask, setPublicTask] = useState(false);

  const handleChangePublic = (e: ChangeEvent<HTMLInputElement>) => {
    setPublicTask(e.target.checked);
  };

  const handleRegisterTask = async (e: FormEvent) => {
    e.preventDefault();

    if (input == "") return;

    try {
      await addDoc(collection(db, "tasks"), {
        task: input,
        created: new Date(),
        user: user?.email,
        public: publicTask,
      });

      setInput("");
      setPublicTask(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>

      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa?</h1>
            <form onSubmit={handleRegisterTask}>
              <TextArea
                placeholder="Digite a sua tarefa"
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(e.target.value)
                }
              />
              <div className={styles.checkboxArea}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={publicTask}
                  onChange={handleChangePublic}
                />
                <label>Deixar tarefa pública</label>
              </div>

              <button type="submit" className={styles.button}>
                Registrar
              </button>
            </form>
          </div>
        </section>

        <section className={styles.taskContainer}>
          <h1>Minhas tarefas</h1>

          <article className={styles.task}>
            <div className={styles.tagContainer}>
              <label className={styles.tag}>PÚBLICA</label>
              <button className={styles.shareButton}>
                <FiShare2 color="#3183ff" size={22} />
              </button>
            </div>

            <div className={styles.taskContent}>
              <p>Minha primeira tarefa!</p>
              <button className={styles.trashButton}>
                <FaTrash color="#ea3140" size={24} />
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        email: session.user?.email,
      },
    },
  };
};
