import React, { useMemo } from "react";
import ILayoutProps from "./ILayoutProps";
import styles from "./Layout.module.scss";
import Head from "next/head";
import Nav from "../nav/Nav";

const Layout: React.FC<ILayoutProps> = ({
  title,
  hideNav,
  maxWidth,
  children,
}) => {
  const fullTitle = useMemo(
    () => [title, "Jake Stanger"].filter((part) => part).join(" | "),
    [title]
  );

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
      </Head>
      <div className={styles.container} style={{ maxWidth: maxWidth }}>
        {!hideNav && <Nav />}
        {title && (
          <header className={styles.title}>
            <h1 className={styles.titleText}>{title}</h1>
          </header>
        )}
        {children}
      </div>
    </>
  );
};

export default Layout;
