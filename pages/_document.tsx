import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Web Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Yantramanav:wght@400;500;700&display=swap"
          rel="stylesheet"
        />

        {/* Icon Font Stylesheet */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css"
          rel="stylesheet"
        />

        {/* 靜態 CSS 文件 */}
        <link href="/lib/animate/animate.min.css" rel="stylesheet" />
        <link href="/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />
        <link href="/lib/lightbox/css/lightbox.min.css" rel="stylesheet" />
        <link href="/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/css/style.css" rel="stylesheet" />
      </Head>
      <body>
        {/* Load jQuery first */}
        <Script
          src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"
          strategy="beforeInteractive"
        />
        
        {/* Load other dependencies */}
        <Script src="/lib/wow/wow.min.js" strategy="beforeInteractive" />
        <Script src="/lib/easing/easing.min.js" strategy="beforeInteractive" />
        <Script src="/lib/waypoints/waypoints.min.js" strategy="beforeInteractive" />
        <Script src="/lib/counterup/counterup.min.js" strategy="beforeInteractive" />
        <Script src="/lib/owlcarousel/owl.carousel.min.js" strategy="beforeInteractive" />
        <Script src="/lib/lightbox/js/lightbox.min.js" strategy="beforeInteractive" />
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
          strategy="beforeInteractive"
        />
        
        {/* Load main.js last */}
        <Script src="/js/main.js" strategy="afterInteractive" />
        
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}