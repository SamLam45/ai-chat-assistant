import "@/styles/globals.css"; // Your global styles
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css";
import "owl.carousel/dist/assets/owl.carousel.min.css";
import "owl.carousel/dist/assets/owl.theme.default.min.css";
import "lightbox2/dist/css/lightbox.min.css";
import "animate.css"; // Ensure this is installed

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Load jQuery first */}
      <Script src="/js/jquery.min.js" strategy="beforeInteractive" />
      
      {/* Load other dependencies */}
      <Script src="/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      <Script src="/js/wow.min.js" strategy="afterInteractive" />
      <Script src="/js/owl.carousel.min.js" strategy="afterInteractive" />
      <Script src="/js/lightbox.min.js" strategy="afterInteractive" />
      
      {/* Load main.js last */}
      <Script src="/js/main.js" strategy="afterInteractive" />
      
      <Component {...pageProps} />
    </>
  );
}