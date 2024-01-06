import { GetStaticProps } from "next";

import Head from "next/head";

import styles from "@/styles/home.module.css";

import Image from "next/image";
import HeroImg from "../../public/assets/hero.png";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

interface HomeProps {
  tasks: number;
  comments: number;
}

export default function Home({ tasks, comments }: HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefas+</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
            className={styles.hero}
            alt="Logo Tarefas+"
            src={HeroImg}
            priority
          />

          <h1 className={styles.title}>
            Sistema feito para você organizar <br />
            seus estudos e tarefas
          </h1>

          <div className={styles.infoContent}>
            <section className={styles.box}>
              <span>+{tasks} posts</span>
            </section>
            <section className={styles.box}>
              <span>+{comments} comentários</span>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const commentsRef = collection(db, "comments");
  const tasksRef = collection(db, "tasks");

  const commentsSnapshot = await getDocs(commentsRef);
  const tasksSnapshot = await getDocs(tasksRef);

  return {
    props: {
      tasks: tasksSnapshot.size || 0,
      comments: commentsSnapshot.size || 0,
    },
    revalidate: 60,
  };
};
