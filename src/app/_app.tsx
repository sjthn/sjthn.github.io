import NavHeader from "../components/nav_header";
import styles from "./styles.module.css";
export default function App({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavHeader />
      <section className={styles.section}>{children}</section>
    </>
  );
}
