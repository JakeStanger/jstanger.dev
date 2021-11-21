import React from "react";
import styles from "./Contact.module.scss";
import Layout from "../../components/layout/Layout";

const Contact: React.FC = () => {
  return (
    <Layout title={"Contact"}>
      <section className={styles.summary}>
        <p>
          Hi, I&apos;m a professional full-stack web developer
          specialising/interested in modern technologies like TypeScript, React
          and Rust. Professionally I work with the SharePoint framework and
          Azure DevOps. Feel free to contact me using any of the below:
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

        <div>Twitter</div>
        <div>
          <a
            href="https://twitter.com/cakestanger"
            target="_blank"
            rel="noreferrer"
          >
            @cakestanger
          </a>
        </div>
        <div>Discord</div>
        <div>
          <a
            href="https://discordapp.com/users/142688838127583232"
            target="_blank"
            rel="noreferrer"
          >
            Cake 🎂#2112
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
