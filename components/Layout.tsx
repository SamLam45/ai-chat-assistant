import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{title} - 全球视野</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta content="" name="keywords" />
        <meta content="" name="description" />
      </Head>

      <Script src="/js/main.js" strategy="afterInteractive" />

      {/* Topbar Start */}
      <div className="container-fluid px-5 d-none d-lg-block" style={{ backgroundColor: '#f28b00' }}>
        <div className="row gx-0 align-items-center" style={{ height: '45px' }}>
          <div className="col-lg-8 text-center text-lg-start mb-lg-0">
            <div className="d-flex flex-wrap">
              <a href="#" className="text-light me-4"><i className="fas fa-phone-alt text-primary me-2"></i>+86 123-4567-890</a>
              <a href="mailto:info@globalvisionelite.com" className="text-light me-4"><i className="fas fa-envelope text-primary me-2"></i>info@globalvisionelite.com</a>
              <a href="#" className="text-light me-0"><i className="fas fa-share-alt text-primary me-2"></i>关注我们：微信、LinkedIn、微博</a>
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
              <Link href="/">
                <a className={`nav-item nav-link${router.pathname === '/' ? ' active' : ''}`}>首页</a>
              </Link>
              <Link href="/about">
                <a className={`nav-item nav-link${router.pathname === '/about' ? ' active' : ''}`}>关于我们</a>
              </Link>
              <Link href="/training">
                <a className={`nav-item nav-link${router.pathname === '/training' ? ' active' : ''}`}>服务项目</a>
              </Link>
              <Link href="/team">
                <a className={`nav-item nav-link${router.pathname === '/team' ? ' active' : ''}`}>团队介绍</a>
              </Link>
              <Link href="/testimonial">
                <a className={`nav-item nav-link${router.pathname === '/testimonial' ? ' active' : ''}`}>学员评价</a>
              </Link>
              <Link href="/blog">
                <a className={`nav-item nav-link${router.pathname === '/blog' ? ' active' : ''}`}>博客资讯</a>
              </Link>
              <Link href="/contact">
                <a className="nav-item nav-link">联系我们</a>
              </Link>
            </div>
          </div>
        </nav>
      </div>
      {/* Navbar End */}

      <main>{children}</main>


    {/* Footer Start */}
      <div className="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item d-flex flex-column">
                <div className="footer-item">
                  <h4 className="text-white mb-4">全球视野</h4>
                  <p className="text-white mb-3">致力于培养具有全球视野和批判性思维的中国青少年，助力他们成为未来领袖。</p>
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
                <h4 className="text-white mb-4">地址</h4>
                <div className="d-flex align-items-center mb-3">
                  <a className="btn btn-lg-square btn-primary rounded-circle mx-2" href=""><i className="fas fa-map-marker-alt"></i></a>
                  <div className="text-white ms-2">
                    <p className="mb-0">香港中环教育大厦18楼</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <a className="btn btn-lg-square btn-primary rounded-circle mx-2" href=""><i className="fa fa-phone-alt"></i></a>
                  <div className="text-white ms-2">
                    <p className="mb-0">+86 123-4567-890</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <a className="btn btn-lg-square btn-primary rounded-circle mx-2" href=""><i className="fas fa-envelope"></i></a>
                  <div className="text-white ms-2">
                    <p className="mb-0">info@globalvisionelite.com</p>
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
                  <p className="text-white mb-3">获取最新课程信息和教育资讯。</p>
                  <div className="position-relative mx-auto rounded-pill">
                    <input className="form-control rounded-pill w-100 py-3 ps-4 pe-5" type="text" placeholder="输入您的邮箱" />
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
              <span className="text-white"><a href="#" className="border-bottom text-white"><i className="fas fa-copyright text-light me-2"></i>全球视野新一代精英少年培训计划</a>，版权所有。</span>
            </div>
            <div className="col-md-6 text-center text-md-end text-white">
            </div>
          </div>
        </div>
      </div>
      {/* Copyright End */}
    </>
  );
};

export default Layout; 