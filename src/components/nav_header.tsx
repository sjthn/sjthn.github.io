import React from "react";
import Link from "next/link";
import styles from "./styles.module.css";
export default function NavHeader() {
  return (
    <div className={styles.header}>
      <h2>srijith</h2>
      <nav className={styles.nav}>
        <ol
          style={{
            listStyle: "none",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            paddingLeft: 0,
          }}
        >
          <li style={{ paddingRight: "16px" }}>
            <Link style={{ color: "white" }} href="/">
              Home
            </Link>
          </li>
          <li style={{ paddingRight: "16px" }}>
            <Link style={{ color: "white" }} href="/blog">
              Blog
            </Link>
          </li>
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "white" }}
              href="https://twitter.com/srijith_un"
            >
              Twitter
            </a>
          </li>
        </ol>
      </nav>
    </div>
  );
}
