import type { NextPage } from "next";
import Head from "next/head";
import Layout from "../components/layout/Layout";
import styles from "./Home.module.scss";
import Link from "next/link";
import Background from "../components/background/Background";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Jake Stanger</title>
      </Head>

      <Layout title={null} hideNav>
        <Background />
        <section className={styles.splash}>
          <h1 className={styles.header}>
            <span>$</span>
            <span>Hello</span>
            <span className={styles.cursor}>_</span>
          </h1>
          <div className={styles.links}>
            <Link href="/blog">
              <a className={styles.link}>Blog</a>
            </Link>
            <Link href="/contact">
              <a className={styles.link}>Contact</a>
            </Link>
            <a
              href="https://github.com/jakestanger"
              className={styles.link}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
          <div className={styles.tagline}>
            <div>Full Stack Developer</div>
            <div>Linux Nerd</div>
          </div>
        </section>
      </Layout>
    </div>
  );
};

export default Home;
