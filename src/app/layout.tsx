import { Source_Code_Pro } from "next/font/google";
import App from "./_app";
import styles from "./styles.module.css";

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sourceCodePro.className}>
      <body className={styles.body}>
        <App children={children} />
      </body>
    </html>
  );
}
