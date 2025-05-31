import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";
import "animate.css";
import Link from "next/link";
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

interface TrainingProps {
  user: User | null;
}

export default function Training({ user }: TrainingProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  useEffect(() => {
    const initWOW = () => {
      if (typeof window !== "undefined" && window.WOW) {
        const wow = new window.WOW({
          boxClass: "wow",
          animateClass: "animate__animated",
          offset: 0,
          mobile: true,
          live: true,
        });
        wow.init();
        window.addEventListener("scroll", () => wow.sync());
      }
    };

    if (typeof window !== "undefined") {
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
        <title>全球视野 - 服务项目</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="全球视野, 青少年培训, 精英教育, 国际视野, 香港导师" />
        <meta name="description" content="通过专属国际视野培训项目，激发中国青少年潜能，培养未来全球领袖。" />
      </Head>

      <Script src="/js/main.js" strategy="afterInteractive" />

      {/* Topbar Start */}
      <div className="container-fluid px-5 d-none d-lg-block" style={{ backgroundColor: '#f28b00' }}>
        <div className="row gx-0 align-items-center" style={{ height: "45px" }}>
          <div className="col-lg-8 text-center text-lg-start mb-lg-0">
            <div className="d-flex flex-wrap">
              <a href="#" className="text-light me-4">
                <i className="fas fa-map-marker-alt text-primary me-2"></i>联系方式：+86 123-4567-890
              </a>
              <a href="mailto:info@globalvisionelite.com" className="text-light me-4">
                <i className="fas fa-envelope text-primary me-2"></i>info@globalvisionelite.com
              </a>
              <a href="#" className="text-light me-0">
                <i className="fas fa-share-alt text-primary me-2"></i>关注我们：微信、LinkedIn、微博
              </a>
            </div>
          </div>
          <div className="col-lg-4 text-center text-lg-end">
            <div className="d-flex justify-content-end">
              <div className="border-end border-start py-1">
                <a href="#" className="btn text-primary">
                  <i className="fab fa-weixin"></i>
                </a>
              </div>
              <div className="border-end py-1">
                <a href="#" className="btn text-primary">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
              <div className="border-end py-1">
                <a href="#" className="btn text-primary">
                  <i className="fab fa-weibo"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Topbar End */}

      {/* Navbar & Hero Start */}
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
                <button className="btn btn-primary rounded-circle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false" onClick={() => router.push('/login')}>
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
                <a className="btn btn-primary rounded-pill text-white py-2 px-4 flex-wrap flex-sm-shrink-0">立即註冊</a>
              </Link>
            )}
          </div>
        </nav>
      </div>
      {/* Navbar & Hero End */}

      {/* Header Start */}
      <div className="container-fluid bg-breadcrumb" style={{ backgroundImage: 'url(/img/teaching-1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container text-center py-5" style={{ maxWidth: "900px" }}>
          <h3 className="text-primary display-3 mb-4 wow fadeInDown" data-wow-delay="0.1s">
            服务项目
          </h3>
          <ol className="breadcrumb justify-content-center text-white mb-0 wow fadeInDown" data-wow-delay="0.3s">
            <li className="breadcrumb-item">
              <Link href="/">
                <a className="text-dark">首页</a>
              </Link>
            </li>
            <li className="breadcrumb-item">
              <a href="#" className="text-dark">页面</a>
            </li>
            <li className="breadcrumb-item active text-primary">服务项目</li>
          </ol>
        </div>
      </div>
      {/* Header End */}

      {/* Banner Start */}
      <div className="container-fluid wow zoomInDown" data-wow-delay="0.1s" style={{ backgroundColor: '#f28b00' }}>
        <div className="container">
          <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center text-center p-5">
            <h1 className="me-4">
              <span className="fw-normal">加入我们今日，</span>
              <span>赋能新一代全球青年领袖</span>
            </h1>
            <a href="#" className="text-white fw-bold fs-2">
              <i className="fa fa-phone me-1"></i> +86 123-4567-890
            </a>
          </div>
        </div>
      </div>
      {/* Banner End */}

      {/* Training Start */}
      <div className="container-fluid training bg-white py-5">
        <div className="container py-5">
          <div className="pb-5">
            <div className="row g-4 align-items-end">
              <div className="col-xl-8">
                <h4 className="sub-title fw-bold wow fadeInUp team-orange" data-wow-delay="0.1s">
                  服务项目
                </h4>
                <h1 className="display-2 mb-0 wow fadeInUp" data-wow-delay="0.3s">
                  服务项目平台
                </h1>
              </div>
              <div className="col-xl-4 text-xl-end wow fadeInUp" data-wow-delay="0.3s">
                <a className="btn btn-primary rounded-pill text-white py-3 px-5" href="#">
                  查看所有服务
                </a>
              </div>
            </div>
          </div>
          <div className="row g-4">
            {[
              {
                icon: "fas fa-calendar-alt",
                title: "12个月沉浸式课程",
                description: "每月围绕AI、国际关系等12大主题展开，系统化培养全球视野。",
                image: "/img/teaching-training-1.jpg"
              },
              {
                icon: "fas fa-users",
                title: "1对2小组辅导",
                description: "香港及海外精英大学生导师，非大班网课，个性化指导。",
                image: "/img/teaching-training-2.jpg"
              },
              {
                icon: "fas fa-language",
                title: "双语课程",
                description: "结合新闻分析与批判性思维训练，提升语言与思维能力。",
                image: "/img/teaching-training-3.jpg"
              },
              {
                icon: "fas fa-building",
                title: "独家企业参观与大师班",
                description: "每年两次一线城市高端沙龙（北京、上海、深圳、香港）。",
                image: "/img/teaching-training-4.jpg"
              },
              {
                icon: "fas fa-certificate",
                title: "国际素养证书",
                description: "结业颁发由香港精英教育机构认证的国际素养证书。",
                image: "/img/teaching-training-5.jpg"
              }
            ].map((item, index) => (
              <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay={`${0.1 * (index + 1)}s`} key={index}>
                <div className="training-item bg-white rounded">
                  <div className="training-img rounded-top">
                    <img src={item.image} className="img-fluid rounded-top w-100" alt="教师教导学生" />
                  </div>
                  <div className="bg-light rounded-bottom p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="btn-square bg-primary rounded-circle me-3">
                        <i className={`${item.icon} text-white`}></i>
                      </div>
                      <h4 className="mb-0">{item.title}</h4>
                    </div>
                    <p className="mb-0">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Training End */}

      {/* Modal Video */}
      <div className="modal fade" id="videoModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content rounded-0">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                视频展示
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="ratio ratio-16x9">
                {/* Ensure an iframe or content is embedded here */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal End */}


      {/* Footer Start */}
      <div className="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item d-flex flex-column">
                <div className="footer-item">
                  <h4 className="text-white mb-4">全球视野</h4>
                  <p className="text-white mb-3">
                    致力于培养具有全球视野和批判性思维的中国青少年，助力他们成为未来领袖。
                  </p>
                  <div className="d-flex">
                    <a className="btn btn-lg-square btn-primary rounded-circle me-2" href="">
                      <i className="fab fa-weixin"></i>
                    </a>
                    <a className="btn btn-lg-square btn-primary rounded-circle mx-2" href="">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a className="btn btn-lg-square btn-primary rounded-circle mx-2" href="">
                      <i className="fab fa-weibo"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item d-flex flex-column">
                <h4 className="text-white mb-4">地址</h4>
                <div className="d-flex align-items-center mb-3">
                  <a className="btn btn-lg-square btn-primary rounded-circle mx-2" href="">
                    <i className="fas fa-map-marker-alt"></i>
                  </a>
                  <div className="text-white ms-2">
                    <p className="mb-0">香港中环教育大厦18楼</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <a className="btn btn-lg-square btn-primary rounded-circle mx-2" href="">
                    <i className="fa fa-phone-alt"></i>
                  </a>
                  <div className="text-white ms-2">
                    <p className="mb-0">+86 123-4567-890</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <a className="btn btn-lg-square btn-primary rounded-circle mx-2" href="">
                    <i className="fas fa-envelope"></i>
                  </a>
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
                    <button type="button" className="btn btn-primary rounded-pill position-absolute top-0 end-0 py-2 mt-2 me-2">
                      订阅
                    </button>
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
              <span className="text-white">
                <a href="#" className="border-bottom text-white">
                  <i className="fas fa-copyright text-light me-2"></i>全球视野新一代精英少年培训计划
                </a>
                ，版权所有。
              </span>
            </div>
            <div className="col-md-6 text-center text-md-end text-white"></div>
          </div>
        </div>
      </div>
      {/* Copyright End */}

      {/* Back to Top */}
      <a href="#" className="btn btn-primary btn-lg-square back-to-top">
        <i className="fa fa-arrow-up"></i>
      </a>
    </>
  );
}