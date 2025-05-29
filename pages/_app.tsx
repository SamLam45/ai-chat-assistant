import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from 'next/head'
import Script from 'next/script'
import '../styles/globals.css';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>JustDance - Dance Class Website</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Component {...pageProps} />

   
      <Script src="https://code.jquery.com/jquery-3.6.0.min.js" strategy="beforeInteractive" />
      
  
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
      
    
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.min.js" strategy="beforeInteractive" />
      
   
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js" strategy="beforeInteractive" />
      
  
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/js/lightbox.min.js" strategy="beforeInteractive" />
      
  
      <Script src="/js/main.js" strategy="afterInteractive" />
    </>
  );
}
