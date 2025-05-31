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
import { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabase'; // Ensure this path is correct
import type { User } from '@supabase/supabase-js';

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

// Define the context type
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  // Optional: Show a loading state while fetching the initial session
  if (loading) {
    return <div>Loading...</div>; // Replace with your actual loading component
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

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
    <AuthProvider>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}