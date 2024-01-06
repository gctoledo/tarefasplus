import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { GetServerSideProps } from "next";

import Link from "next/link";

import Head from "next/head";

import { getSession } from "next-auth/react";

import styles from "./styles.module.css";

import TextArea from "@/components/textarea";

import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";

import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

interface DashboardProps {
  user: {
    email: string;
  };
}

interface TaskProps {
  id: string;
  created: Date;
  public: boolean;
  task: string;
  user: string;
}

const Dashboard = ({ user }: DashboardProps) => {
  const [input, setInput] = useState("");
  const [publicTask, setPublicTask] = useState(false);
  const [tasks, setTasks] = useState<TaskProps[]>([]);

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

  useEffect(() => {
    async function loadTasks() {
      const tasksRef = collection(db, "tasks");
      const q = query(
        tasksRef,
        orderBy("created", "desc"),
        where("user", "==", user?.email)
      );

      onSnapshot(q, (snapshot) => {
        let list = [] as TaskProps[];

        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            created: doc.data().created,
            public: doc.data().public,
            task: doc.data().task,
            user: doc.data().user,
          });
        });

        setTasks(list);
      });
    }

    loadTasks();
  }, [user?.email]);

  const handleDeleteTask = async (id: string) => {
    const taskRef = doc(db, "tasks", id);

    await deleteDoc(taskRef);
  };

  const handleShare = async (id: string) => {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    );
    console.log("URL COPIADA COM SUCESSO");
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

          {tasks.map((task) => (
            <article className={styles.task} key={task.id}>
              {task.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>PÚBLICA</label>
                  <button
                    className={styles.shareButton}
                    onClick={() => handleShare(task.id)}
                  >
                    <FiShare2 color="#3183ff" size={22} />
                  </button>
                </div>
              )}
              <div className={styles.taskContent}>
                {task.public ? (
                  <Link href={`/task/${task.id}`}>
                    <p>{task.task}</p>
                  </Link>
                ) : (
                  <p>{task.task}</p>
                )}

                <button
                  className={styles.trashButton}
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <FaTrash color="#ea3140" size={24} />
                </button>
              </div>
            </article>
          ))}
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
