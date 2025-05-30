import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from "next/link";

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

export default function Blog() {
  const router = useRouter();

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
        <title>全球视野 - 学员评价</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="全球视野, 学员评价, 精英教育, 青少年培训, 国际视野" />
        <meta name="description" content="了解全球视野学员的真实反馈，体验精英教育带来的改变。" />
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
      <div className="container-fluid bg-warning px-5 d-none d-lg-block">
        <div className="row gx-0 align-items-center" style={{ height: '45px' }}>
          <div className="col-lg-8 text-center text-lg-start mb-lg-0">
            <div className="d-flex flex-wrap">
              <a href="#" className="text-light me-4"><i className="fas fa-map-marker-alt text-primary me-2"></i>联系方式：+86 123-4567-890</a>
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
            <a href="#" className="btn btn-primary rounded-pill text-white py-2 px-4 flex-wrap flex-sm-shrink-0">
              立即註冊
            </a>
          </div>
        </nav>
      </div>
      {/* Navbar & Hero End */}

     {/* Header Start */}
      <div className="container-fluid bg-breadcrumb">
        <div className="container text-center py-5" style={{ maxWidth: "900px" }}>
          <h3 className="text-primary display-3 animate__animated animate__fadeInDown" data-wow-delay="0.1s">
            博客资讯
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
            <li className="breadcrumb-item active text-primary">博客资讯</li>
          </ol>
        </div>
      </div>
      {/* Header End */}

      {/* Banner Start */}
      <div className="container-fluid bg-warning wow zoomInDown" data-wow-delay="0.1s">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center text-center p-5">
            <h1 className="me-4"><span className="fw-normal">加入我们今日，</span><span>赋能新一代全球青年领袖</span></h1>
            <a href="#" className="text-white fw-bold fs-2"><i className="fa fa-phone me-1"></i> +86 123-4567-890</a>
          </div>
        </div>
      </div>
      {/* Banner End */}


      {/* Blogs Start */}
      <div className="container-fluid blog py-5 bg-white">
        <div className="container py-5">
          <div className="pb-5">
            <h4 className="sub-title fw-bold animate__animated animate__fadeInUp team-orange" data-wow-delay="0.1s">博客与新闻</h4>
            <h1 className="display-2 mb-0 animate__animated animate__fadeInUp" data-wow-delay="0.3s">最新新闻与文章</h1>
          </div>
          <div className="blog-carousel owl-carousel pt-5 animate__animated animate__fadeInUp" data-wow-delay="0.1s">
            <div className="blog-item bg-white rounded animate__animated animate__fadeInUp" data-wow-delay="0.1s">
              <div className="blog-img rounded-top">
                <img src="/img/class-1.jpg" className="img-fluid rounded-top w-100" alt="Image" />
              </div>
              <div className="bg-light rounded-bottom p-4">
                <div className="d-flex justify-content-between mb-4">
                  <a href="#" className="text-muted"><i className="fa fa-calendar-alt text-primary"></i> 2025年8月28日</a>
                  <a href="#" className="text-muted"><span className="fa fa-comments text-primary"></span> 3条评论</a>
                </div>
                <a href="#" className="h4 mb-3 d-block">人工智能如何改变未来职业：学生必备知识</a>
                <p className="mb-3">探讨人工智能对职业发展的影响，帮助学生了解未来职场趋势。</p>
                <a className="btn btn-primary rounded-pill text-white py-2 px-4" href="#">阅读更多</a>
              </div>
            </div>
            <div className="blog-item bg-white rounded animate__animated animate__fadeInUp" data-wow-delay="0.3s">
              <div className="blog-img rounded-top">
                <img src="/img/class-2.jpg" className="img-fluid rounded-top w-100" alt="Image" />
              </div>
              <div className="bg-light rounded-bottom p-4">
                <div className="d-flex justify-content-between mb-4">
                  <a href="#" className="text-muted"><i className="fa fa-calendar-alt text-primary"></i> 2025年8月28日</a>
                  <a href="#" className="text-muted"><span className="fa fa-comments text-primary"></span> 3条评论</a>
                </div>
                <a href="#" className="h4 mb-3 d-block">跨文化沟通技巧，助力留学成功</a>
                <p className="mb-3">学习如何在不同文化背景下有效沟通，为海外留学铺平道路。</p>
                <a className="btn btn-primary rounded-pill text-white py-2 px-4" href="#">阅读更多</a>
              </div>
            </div>
            <div className="blog-item bg-white rounded animate__animated animate__fadeInUp" data-wow-delay="0.5s">
              <div className="blog-img rounded-top">
                <img src="/img/class-3.jpg" className="img-fluid rounded-top w-100" alt="Image" />
              </div>
              <div className="bg-light rounded-bottom p-4">
                <div className="d-flex justify-content-between mb-4">
                  <a href="#" className="text-muted"><i className="fa fa-calendar-alt text-primary"></i> 2025年8月28日</a>
                  <a href="#" className="text-muted"><span className="fa fa-comments text-primary"></span> 3条评论</a>
                </div>
                <a href="#" className="h4 mb-3 d-block">导师分享：如何平衡学习与心理健康</a>
                <p className="mb-3">导师提供实用建议，帮助学生在高压学业中保持心理健康。</p>
                <a className="btn btn-primary rounded-pill text-white py-2 px-4" href="#">阅读更多</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Blogs End */}

      {/* Counter Facts Start */}
      <div className="container-fluid counter-facts py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-6 col-md-6 col-xl-3 wow fadeInUp" data-wow-delay="0.1s">
              <div className="counter">
                <div className="counter-icon w-100 d-flex align-items-center justify-content-center">
                  <h3>课程数量</h3>
                </div>
                <div className="counter-content d-flex align-items-center justify-content-center mt-4">
                  <span className="counter-value" data-toggle="counter-up">5</span>
                  <h4 className="text-warning mb-0" style={{ fontWeight: 600, fontSize: '25px' }}>+</h4>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-xl-3 wow fadeInUp" data-wow-delay="0.3s">
              <div className="counter">
                <div className="counter-icon w-100 d-flex align-items-center justify-content-center">
                  <h3>优秀导师</h3>
                </div>
                <div className="counter-content d-flex align-items-center justify-content-center mt-4">
                  <span className="counter-value" data-toggle="counter-up">49</span>
                  <h4 className="text-warning mb-0" style={{ fontWeight: 600, fontSize: '25px' }}>+</h4>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-xl-3 wow fadeInUp" data-wow-delay="0.5s">
              <div className="counter">
                <div className="counter-icon w-100 d-flex align-items-center justify-content-center">
                  <h3>分校总数</h3>
                </div>
                <div className="counter-content d-flex align-items-center justify-content-center mt-4">
                  <span className="counter-value" data-toggle="counter-up">17</span>
                  <h4 className="text-warning mb-0" style={{ fontWeight: 600, fontSize: '25px' }}>+</h4>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-xl-3 wow fadeInUp" data-wow-delay="0.7s">
              <div className="counter">
                <div className="counter-icon w-100 d-flex align-items-center justify-content-center">
                  <h3>满意学员</h3>
                </div>
                <div className="counter-content d-flex align-items-center justify-content-center mt-4">
                  <span className="counter-value" data-toggle="counter-up">567</span>
                  <h4 className="text-warning mb-0" style={{ fontWeight: 600, fontSize: '25px' }}>+</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Counter Facts End */}

      {/* Training Start */}
      <div className="container-fluid training bg-white py-5">
        <div className="container py-5">
          <div className="pb-5">
            <div className="row g-4 align-items-end">
              <div className="col-xl-8">
                <h4 className="text-warning sub-title fw-bold wow fadeInUp" data-wow-delay="0.1s">精英培训</h4>
                <h1 className="display-2 mb-0 wow fadeInUp" data-wow-delay="0.3s">我们的培训平台</h1>
              </div>
              <div className="col-xl-4 text-xl-end wow fadeInUp" data-wow-delay="0.3s">
                <a className="btn btn-primary rounded-pill text-white py-3 px-5" href="#">查看所有课程</a>
              </div>
            </div>
          </div>
          <div className="training-carousel owl-carousel pt-5 wow fadeInUp" data-wow-delay="0.1s">
            {[1,3,2,4,3].map((num, idx) => (
              <div className="training-item bg-white rounded wow fadeInUp" data-wow-delay={`${0.1 + idx*0.2}s`} key={idx}>
                <div className="training-img rounded-top">
                  <img src={`/img/service-${num}.jpg`} className="img-fluid rounded-top w-100" alt="Image" />
                  <h1 className="fs-1 fw-bold bg-primary text-white d-inline-block rounded p-2 position-absolute" style={{top: 0, left: 0}}>{`0${idx+1}`}</h1>
                </div>
                <div className="rounded-bottom border border-top-0 p-4">
                  <a href="#" className="h4 mb-3 d-block">{num === 1 || num === 4 ? '全球视野课程' : num === 2 ? '双语教学' : '批判性思维训练'}</a>
                  <p className="mb-3 text-muted">通过前沿话题讨论和实践活动，培养学生的国际素养与未来竞争力。</p>
                  <a className="btn btn-primary rounded-pill text-white py-2 px-4" href="#">阅读更多</a>
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
              <h5 className="modal-title" id="exampleModalLabel">YouTube视频</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="ratio ratio-16x9">
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
              <span className="text-white"><a href="#" className="border-bottom text-white"><i className="fas fa-copyright text-light me-2"></i>全球视野</a>，版权所有。</span>
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