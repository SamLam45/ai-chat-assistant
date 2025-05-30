import "@/styles/globals.css"; // Your global styles
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import "owl.carousel/dist/assets/owl.carousel.min.css";
import "owl.carousel/dist/assets/owl.theme.default.min.css";
import "lightbox2/dist/css/lightbox.min.css";
import "animate.css"; // Ensure this is installed

// Add custom styles
const customStyles = `
  .text-secondary {
    color: #FF8C00 !important;
  }
  .bg-secondary {
    background-color: #FF8C00 !important;
  }
  .btn-secondary {
    background-color: #FF8C00 !important;
    border-color: #FF8C00 !important;
  }
  .btn-secondary:hover {
    background-color: #FF7F00 !important;
    border-color: #FF7F00 !important;
  }
  .team-item .team-icon {
    background-color: #FF8C00 !important;
  }
  .owl-nav button {
    background-color: #FF8C00 !important;
  }
  .owl-nav button:hover {
    background-color: #FF7F00 !important;
  }
  .warm-filter {
    filter: sepia(30%) saturate(150%) hue-rotate(5deg);
  }
  .about-img-bg {
    background-color: #FF8C00 !important;
  }
`;

interface JQuery {
  owlCarousel(options?: {
    loop?: boolean;
    margin?: number;
    nav?: boolean;
    dots?: boolean;
    autoplay?: boolean;
    smartSpeed?: number;
    responsive?: {
      [key: number]: {
        items: number;
      };
    };
  }): JQuery;
}

interface JQueryStatic {
  (selector: string): JQuery;
  (element: Element): JQuery;
  (callback: () => void): JQuery;
  (): JQuery;
}

declare global {
  interface Window {
    WOW: {
      new (options?: Record<string, unknown>): {
        init(): void;
        sync(): void;
      };
    };
    $: JQueryStatic;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const initWOW = () => {
      if (typeof window !== 'undefined' && window.WOW) {
        const wow = new window.WOW({
          boxClass: 'wow',
          animateClass: 'animate__animated',
          offset: 0,
          mobile: true,
          live: true,
        });
        wow.init();
        window.addEventListener('scroll', () => wow.sync());
      }
    };

    const initOwlCarousel = () => {
      if (typeof window !== 'undefined' && typeof window.$ === 'function') {
        // Initialize header carousel
        window.$('.header-carousel').owlCarousel({
          loop: true,
          margin: 0,
          nav: true,
          dots: false,
          autoplay: true,
          smartSpeed: 1000,
          responsive: {
            0: { items: 1 }
          }
        });

        // Initialize team carousel
        window.$('.team-carousel').owlCarousel({
          loop: true,
          margin: 30,
          nav: true,
          dots: false,
          autoplay: true,
          smartSpeed: 1000,
          responsive: {
            0: { items: 1 },
            576: { items: 2 },
            768: { items: 3 },
            992: { items: 4 }
          }
        });

        // Initialize blog carousel
        window.$('.blog-carousel').owlCarousel({
          loop: true,
          margin: 30,
          nav: true,
          dots: false,
          autoplay: true,
          smartSpeed: 1000,
          responsive: {
            0: { items: 1 },
            576: { items: 2 },
            768: { items: 3 }
          }
        });

        // Initialize testimonial carousel
        window.$('.testimonial-carousel').owlCarousel({
          loop: true,
          margin: 30,
          nav: true,
          dots: false,
          autoplay: true,
          smartSpeed: 1000,
          responsive: {
            0: { items: 1 },
            576: { items: 2 },
            768: { items: 3 }
          }
        });

        // Initialize training carousel
        window.$('.training-carousel').owlCarousel({
          loop: true,
          margin: 30,
          nav: true,
          dots: false,
          autoplay: true,
          smartSpeed: 1000,
          responsive: {
            0: { items: 1 },
            576: { items: 2 },
            768: { items: 3 }
          }
        });
      }
    };

    // Initialize on first load
    if (typeof window !== 'undefined') {
      if (window.WOW) initWOW();
      if (typeof window.$ === 'function') initOwlCarousel();
    }

    // Initialize on route change
    const handleRouteChange = () => {
      setTimeout(() => {
        initWOW();
        initOwlCarousel();
      }, 100);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <style>{customStyles}</style>
      </Head>
      <Component {...pageProps} />
    </>
  );
}