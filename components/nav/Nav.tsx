import React from "react";
import styles from "./Nav.module.scss";
import { css } from "../../lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";

interface IRoute {
  name: string;
  url: string;
}

const ROUTES: IRoute[] = [
  { name: "Home", url: "/" },
  { name: "Blog", url: "/blog" },
  { name: "Contact", url: "/contact" },
  { name: "GitHub", url: "https://github.com/jakestanger" },
];

const Nav: React.FC = () => {
  const router = useRouter();

  return (
    <nav className={styles.navigation}>
      {ROUTES.map((route) => {
        const isExternal = route.url.startsWith("http");
        const isActive =
          route.url === "/"
            ? route.url === router.route
            : router.route.startsWith(route.url);

        return !isExternal ? (
          <Link key={route.url} href={route.url}>
            <a className={css(styles.link, isActive && styles.active)}>
              {route.name}
            </a>
          </Link>
        ) : (
          <a
            key={route.url}
            href={route.url}
            className={styles.link}
            target="_blank"
            rel="noreferrer"
          >
            {route.name}
          </a>
        );
      })}
    </nav>
  );
};

export default Nav;
