import React from 'react';
import styles from './Contact.module.scss';
import Layout from '../../components/layout/Layout';

const Contact: React.FC = () => {
  return (
    <Layout title={'Contact'}>
      <section className={styles.summary}>
        <p>
          Hi, I&apos;m a full stack developer and Linux-er, with an interest in modern technologies
          like Rust and Typescript and the professional experience to back (most of) it up.
          Check out my GitHub to see some of my projects, or feel free to reach out to me at any of
          the below.
        </p>
      </section>
      <section className={styles.contactDetails}>
        <div>Email</div>
        <div>
          <a href="mailto:mail@jstanger.dev">mail@jstanger.dev</a>
        </div>

        <div>GitHub</div>
        <div>
          <a
            href="https://github.com/jakestanger"
            target="_blank"
            rel="noreferrer"
          >
            @jakestanger
          </a>
        </div>

        <div>Discord</div>
        <div>
          <a
            href="https://discordapp.com/users/142688838127583232"
            target="_blank"
            rel="noreferrer"
          >
            @toadmytoad
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
