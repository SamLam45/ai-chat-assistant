import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (profile?.role !== 'admin') {
        // If not an admin, redirect to student dashboard or a generic page
        router.push('/student/dashboard'); 
      } else {
        setUser(user);
      }
    };
    
    checkUser();
  }, [router]);

  if (!user) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <>
      <Head>
        <title>管理后台 - 全球视野</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta content="" name="keywords" />
        <meta content="" name="description" />
      </Head>

      <Script src="/js/main.js" strategy="afterInteractive" />

      {/* Navbar Start */}
      <div className="container-fluid position-relative p-0">
        <nav className="navbar navbar-expand-lg navbar-light bg-white px-4 px-lg-5 py-3 py-lg-0">
          <Link href="/">
            <a className="navbar-brand p-0" style={{ textDecoration: 'none', position: 'relative', top: '3px' }}>
              <h1 className="text-primary m-0"><i className="fas fa-globe me-3"></i>全球视野</h1>
            </a>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="fa fa-bars"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto py-0">
                <Link href="/"><a className="nav-item nav-link">首页</a></Link>
                <Link href="/about"><a className="nav-item nav-link">关于我们</a></Link>
                <Link href="/training"><a className="nav-item nav-link">服务项目</a></Link>
                <Link href="/team"><a className="nav-item nav-link">团队介绍</a></Link>
                <Link href="/testimonial"><a className="nav-item nav-link">学员评价</a></Link>
                <Link href="/blog"><a className="nav-item nav-link">博客资讯</a></Link>
                <Link href="/contact"><a className="nav-item nav-link">联系我们</a></Link>
            </div>
            <button onClick={async () => {
                await supabase.auth.signOut();
                router.push('/login');
            }} className="btn btn-primary rounded-pill text-white py-2 px-4 flex-wrap flex-sm-shrink-0">Logout</button>
          </div>
        </nav>
      </div>
      {/* Navbar End */}
      
      <div className="container-fluid py-5">
        <div className="container">
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user.email}</p>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard; 