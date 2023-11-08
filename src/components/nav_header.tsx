import React from "react";
import Link from "next/link";
import styles from "./styles.module.css";
export default function NavHeader() {
  return (
    <div className={styles.header}>
      <h1>srijith</h1>
      <nav className={styles.nav}>
        <ol
          style={{
            listStyle: "none",
            fontSize: "20px",
            display: "flex",
            paddingLeft: 0,
          }}
        >
          <li style={{ paddingRight: "16px" }}>
            <Link style={{ color: "white" }} href="/">
              Home
            </Link>
          </li>
          <li>
            <Link style={{ color: "white" }} href="/blog">
              Blog
            </Link>
          </li>
        </ol>
      </nav>
    </div>
  );
}
