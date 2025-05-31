import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import 'animate.css';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

declare global {
  interface Window {
    WOW: {
      new (options?: Record<string, unknown>): {
        init(): void;
        sync(): void;
      };
    };
  }
}

export default function Contact() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 檢查用戶是否已登入
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    // 監聽登入狀態變化
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  useEffect(() => {
    const initWOW = () => {
      if (typeof window !== 'undefined' && window.WOW) {
        const wow = new window.WOW({
          boxClass: 'wow',
          animateClass: 'animate__animated',
          offset: 0,
          mobile: true,
          live: true,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        });
        wow.init();
        window.addEventListener('scroll', () => wow.sync());
      }
    };

    if (typeof window !== 'undefined') {
      if (window.WOW) initWOW();
      else {
        const checkWOW = setInterval(() => {
          if (window.WOW) {
            initWOW();
            clearInterval(checkWOW);
          }
        }, 100);
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>全球视野精英少年培训计划 - 联系我们</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="全球视野, 精英教育, 青少年培训, 国际素养" />
        <meta name="description" content="全球视野新一代精英少年培训计划，培养具有国际视野的中国青少年，助力进入世界顶尖高校。" />
        <link href="/lib/animate/animate.min.css" rel="stylesheet" />
      </Head>

      {/* Scripts */}
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js" strategy="beforeInteractive" />
      <Script src="/lib/wow/wow.min.js" strategy="beforeInteractive" />
      <Script src="/lib/easing/easing.min.js" strategy="beforeInteractive" />
      <Script src="/lib/waypoints/waypoints.min.js" strategy="beforeInteractive" />
      <Script src="/lib/counterup/counterup.min.js" strategy="beforeInteractive" />
      <Script src="/lib/owlcarousel/owl.carousel.min.js" strategy="beforeInteractive" />
      <Script src="/lib/lightbox/js/lightbox.min.js" strategy="beforeInteractive" />
      <Script src="/js/main.js" strategy="afterInteractive" />

      {/* Topbar Start */}
      <div className="container-fluid px-5 d-none d-lg-block" style={{ backgroundColor: '#f28b00' }}>
        <div className="row gx-0 align-items-center" style={{ height: '45px' }}>
          <div className="col-lg-8 text-center text-lg-start mb-lg-0">
            <div className="d-flex flex-wrap">
              <a href="#" className="text-light me-4"><i className="fas fa-phone-alt text-primary me-2"></i>+86 123-4567-890</a>
              <a href="mailto:info@globalvisionelite.com" className="text-light me-4"><i className="fas fa-envelope text-primary me-2"></i>info@globalvisionelite.com</a>
              <a href="#" className="text-light me-0"><i className="fas fa-heart text-primary me-2"></i>关注我们：微信、LinkedIn、微博</a>
            </div>
          </div>
          <div className="col-lg-4 text-center text-lg-end">
            <div className="d-flex justify-content-end">
              <div className="border-end border-start py-1">
                <a href="#" className="btn text-primary"><i className="fab fa-weixin"></i></a>
              </div>
              <div className="border-end py-1">
                <a href="#" className="btn text-primary"><i className="fab fa-linkedin-in"></i></a>
              </div>
              <div className="border-end py-1">
                <a href="#" className="btn text-primary"><i className="fab fa-weibo"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Topbar End */}

      {/* Navbar & Hero Start */}
      <div className="container-fluid position-relative p-0">
        <nav className="navbar navbar-expand-lg navbar-light bg-white px-4 px-lg-5 py-3 py-lg-0">
          <a href="#" className="navbar-brand p-0">
            <h1 className="text-primary m-0"><i className="fas fa-globe me-3"></i>全球视野</h1>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="fa fa-bars"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto py-0">
              <Link href="/">
                <a className={`nav-item nav-link${router.pathname === "/" ? " active" : ""}`}>首页</a>
              </Link>
              <Link href="/about">
                <a className={`nav-item nav-link${router.pathname === "/about" ? " active" : ""}`}>关于我们</a>
              </Link>
              <Link href="/training">
                <a className={`nav-item nav-link${router.pathname === "/training" ? " active" : ""}`}>服务项目</a>
              </Link>
              <Link href="/team">
                <a className={`nav-item nav-link${router.pathname === "/team" ? " active" : ""}`}>团队介绍</a>
              </Link>
              <Link href="/testimonial">
                <a className={`nav-item nav-link${router.pathname === "/testimonial" ? " active" : ""}`}>学员评价</a>
              </Link>
              <Link href="/blog">
                <a className={`nav-item nav-link${router.pathname === "/blog" ? " active" : ""}`}>博客资讯</a>
              </Link>
              <Link href="/contact">
                <a className="nav-item nav-link">联系我们</a>
              </Link>
            </div>
            {user ? (
              <div className="dropdown">
                <button className="btn btn-primary rounded-circle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="fas fa-user"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li><span className="dropdown-item-text">{user.email}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>登出</button></li>
                </ul>
              </div>
            ) : (
              <Link href="/login">
                <a className="btn btn-primary rounded-circle">
                  <i className="fas fa-user"></i>
                </a>
                <a className="btn btn-primary rounded-pill text-white py-2 px-4 flex-wrap flex-sm-shrink-0">立即註冊</a>
              </Link>
            )}
          </div>
        </nav>
      </div>
      {/* Navbar & Hero End */}


     {/* Header Start */}
      <div className="container-fluid bg-breadcrumb">
        <div className="container text-center py-5" style={{ maxWidth: "900px" }}>
          <h3 className="text-primary display-3 animate__animated animate__fadeInDown" data-wow-delay="0.1s">
            联系我们
          </h3>
          <ol className="breadcrumb justify-content-center text-white mb-0 animate__animated animate__fadeInDown" data-wow-delay="0.3s">
            <li className="breadcrumb-item">
              <Link href="/">
                <a className="text-dark">首页</a>
              </Link>
            </li>
            <li className="breadcrumb-item">
              <a href="#" className="text-dark">页面</a>
            </li>
            <li className="breadcrumb-item active text-primary">联系我们</li>
          </ol>
        </div>
      </div>
      {/* Header End */}

       {/* Banner Start */}
      <div className="container-fluid wow zoomInDown" data-wow-delay="0.1s" style={{ backgroundColor: '#f28b00' }}>
        <div className="container">
          <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center text-center p-5">
            <h1 className="me-4"><span className="fw-normal">加入我们今日，</span><span>赋能新一代全球青年领袖</span></h1>
            <a href="#" className="text-white fw-bold fs-2"><i className="fa fa-phone me-1"></i> +86 123-4567-890</a>
          </div>
        </div>
      </div>
      {/* Banner End */}

      {/* Contact Start */}
      <div className="container-fluid contact bg-light py-5">
        <div className="container py-5">
          <div className="pb-5">
            <h4 className="sub-title fw-bold wow fadeInUp team-orange" data-wow-delay="0.1s">联系我们</h4>
            <h1 className="display-2 mb-0 wow fadeInUp" data-wow-delay="0.3s">获取联系</h1>
          </div>
          <div className="bg-light rounded p-4 pb-0">
            <div className="row g-5 align-items-center">
              <div className="col-lg-6 wow fadeInLeft" data-wow-delay="0.1s">
                <h2 className="display-5 mb-2">联系表单</h2>
                <form>
                  <div className="row g-3">
                    <div className="col-lg-12 col-xl-6">
                      <div className="form-floating">
                        <input type="text" className="form-control" id="name" placeholder="姓名" />
                        <label htmlFor="name">姓名</label>
                      </div>
                    </div>
                    <div className="col-lg-12 col-xl-6">
                      <div className="form-floating">
                        <input type="email" className="form-control" id="email" placeholder="邮箱" />
                        <label htmlFor="email">邮箱</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea className="form-control" placeholder="留言" id="message" style={{ height: '160px' }}></textarea>
                        <label htmlFor="message">留言</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100 py-3">发送消息</button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-lg-6 wow fadeInRight" data-wow-delay="0.3s">
                <div className="d-flex align-items-center mb-5">
                  <div className="mb-3"><i className="fa fa-home fa-2x text-primary"></i></div>
                  <div className="ms-4">
                    <h4>地址</h4>
                    <p className="mb-0 text-dark">香港中环教育大厦18楼</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-5">
                  <div className="mb-3"><i className="fa fa-phone-alt fa-2x text-primary"></i></div>
                  <div className="ms-4">
                    <h4>电话</h4>
                    <p className="mb-0 text-dark">+86 123-4567-890</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-5">
                  <div className="mb-3"><i className="fa fa-envelope-open fa-2x text-primary"></i></div>
                  <div className="ms-4">
                    <h4>邮箱</h4>
                    <p className="mb-0 text-dark">info@globalvisionelite.com</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="me-4">
                    <i className="fas fa-share-alt fa-2x text-primary"></i>
                  </div>
                  <div className="d-flex">
                    <a className="btn btn-lg-square btn-primary rounded-circle me-2" href=""><i className="fab fa-weixin"></i></a>
                    <a className="btn btn-lg-square btn-primary rounded-circle mx-2" href=""><i className="fab fa-linkedin-in"></i></a>
                    <a className="btn btn-lg-square btn-primary rounded-circle mx-2" href=""><i className="fab fa-weibo"></i></a>
                  </div>
                </div>
              </div>
              <div className="col-12 wow fadeInUp" data-wow-delay="0.1s">
                <div className="rounded h-100 pb-3">
                  <iframe className="rounded w-100" 
                  style={{ height: '500px' }} 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3692.059136822495!2d114.1572953151873!3d22.28398138532323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3404005b3b1c1c1b%3A0x9a9a9a9a9a9a9a9a!2sCentral%2C%20Hong%20Kong!5e0!3m2!1sen!2sbd!4v1694259649153!5m2!1sen!2sbd" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Contact End */}

      {/* Footer Start */}
      <div className="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item d-flex flex-column">
                <div className="footer-item">
                  <h4 className="text-white mb-4">全球视野</h4>
                  <p className="text-white mb-3">我们是一支总部位于香港的精英教育团队，致力于培养具有全球视野和批判性思维的中国青少年，助力他们进入世界顶尖高校和职场。</p>
                  <div className="d-flex">
                    <a className="btn btn-lg-square btn-primary rounded-circle me-2" href=""><i className="fab fa-weixin"></i></a>
                    <a className="btn btn-lg-square btn-primary rounded-circle mx-2" href=""><i className="fab fa-linkedin-in"></i></a>
                    <a className="btn btn-lg-square btn-primary rounded-circle mx-2" href=""><i className="fab fa-weibo"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item d-flex flex-column">
                <h4 className="text-white mb-4">联系方式</h4>
                <div className="d-flex align-items-center mb-3">
                  <a className="btn btn-lg-square btn-primary rounded-circle mx-2" href=""><i className="fas fa-map-marker-alt"></i></a>
                  <div className="text-white ms-2">
                    <p className="mb-0 text-dark">香港中环教育大厦18楼</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <a className="btn btn-lg-square btn-primary rounded-circle mx-2" href=""><i className="fa fa-phone-alt"></i></a>
                  <div className="text-white ms-2">
                    <p className="mb-0 text-dark">+86 123-4567-890</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <a className="btn btn-lg-square btn-primary rounded-circle mx-2" href=""><i className="fas fa-envelope"></i></a>
                  <div className="text-white ms-2">
                    <p className="mb-0 text-dark">info@globalvisionelite.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item d-flex flex-column">
                <h4 className="text-white mb-4">快速链接</h4>
                <a href="#" className="footer-link">关于我们</a>
                <a href="#" className="footer-link">服务项目</a>
                <a href="#" className="footer-link">隐私政策</a>
                <a href="#" className="footer-link">服务条款</a>
                <a href="#" className="footer-link">课程安排</a>
                <a href="#" className="footer-link">常见问题</a>
                <a href="#" className="footer-link">联系我们</a>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item d-flex flex-column">
                <div className="footer-item">
                  <h4 className="text-white mb-4">订阅资讯</h4>
                  <p className="text-white mb-3">订阅我们的资讯，获取最新课程信息与活动通知。</p>
                  <div className="position-relative mx-auto rounded-pill">
                    <input className="form-control rounded-pill w-100 py-3 ps-4 pe-5" type="text" placeholder="请输入您的邮箱" />
                    <button type="button" className="btn btn-primary rounded-pill position-absolute top-0 end-0 py-2 mt-2 me-2">订阅</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer End */}

      {/* Copyright Start */}
      <div className="container-fluid copyright py-4">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-6 text-center text-md-start mb-md-0">
              <span className="text-white"><a href="#" className="border-bottom text-white">© 2025 全球视野新一代精英少年培训计划</a> | 隐私政策 | 服务条款</span>
            </div>
            <div className="col-md-6 text-center text-md-end text-white">
             
            </div>
          </div>
        </div>
      </div>
      {/* Copyright End */}

      {/* Back to Top */}
      <a href="#" className="btn btn-primary btn-lg-square back-to-top"><i className="fa fa-arrow-up"></i></a>
    </>
  );
}