import { Source_Code_Pro } from "next/font/google";
import Script from "next/script";
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
        <Script src="https://www.googletagmanager.com/gtag/js?id=UA-160355954-1"></Script>
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-160355954-1');
          `}
        </Script>
      </body>
    </html>
  );
}
