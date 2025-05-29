import Head from 'next/head';
import Image from 'next/image';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import 'animate.css';

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

export default function About() {
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
          callback: function(box: HTMLElement) {
            // Optional callback when animation is triggered
          },
          scrollContainer: null
        });
        
        // Initialize WOW
        wow.init();
        
        // Force refresh on scroll
        window.addEventListener('scroll', () => {
          wow.sync();
        });
      }
    };

    // Wait for WOW.js to load
    if (typeof window !== 'undefined') {
      if (window.WOW) {
        initWOW();
      } else {
        // If WOW is not loaded yet, wait for it
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
        <title>全球视野 - 关于我们</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta content="全球视野, 青少年培训, 精英教育, 国际视野, 香港导师" name="keywords" />
        <meta content="通过专属国际视野培训项目，激发中国青少年潜能，培养未来全球领袖。" name="description" />
      </Head>

      
      {/* Load main.js last */}
      <Script src="/js/main.js" strategy="afterInteractive" />

      {/* Topbar Start */}
      <div className="container-fluid bg-secondary px-5 d-none d-lg-block">
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
              <a href="/" className={`nav-item nav-link${router.pathname === '/' ? ' active' : ''}`}>首页</a>
              <a href="/about" className={`nav-item nav-link${router.pathname === '/about' ? ' active' : ''}`}>关于我们</a>
              <a href="/training" className={`nav-item nav-link${router.pathname === '/training' ? ' active' : ''}`}>服务项目</a>
              <a href="/team" className={`nav-item nav-link${router.pathname === '/team' ? ' active' : ''}`}>团队介绍</a>
              <a href="/testimonial" className={`nav-item nav-link${router.pathname === '/testimonials' ? ' active' : ''}`}>学员评价</a>
              <a href="/blog" className={`nav-item nav-link${router.pathname === '/blog' ? ' active' : ''}`}>博客资讯</a>
              <a href="/contact" className="nav-item nav-link">联系我们</a>
            </div>
            <a href="#" className="btn btn-primary rounded-pill text-white py-2 px-4 flex-wrap flex-sm-shrink-0">立即註冊</a>
          </div>
        </nav>
      </div>
      {/* Navbar & Hero End */}

      {/* Header Start */}
      <div className="container-fluid bg-breadcrumb">
        <div className="container text-center py-5" style={{ maxWidth: '900px' }}>
          <h3 className="text-primary display-3 animate__animated animate__fadeInDown" data-wow-delay="0.1s">关于我们</h3>
          <ol className="breadcrumb justify-content-center text-white mb-0 animate__animated animate__fadeInDown" data-wow-delay="0.3s">
            <li className="breadcrumb-item"><a href="/" className="text-dark">首页</a></li>
            <li className="breadcrumb-item"><a href="#" className="text-dark">页面</a></li>
            <li className="breadcrumb-item active text-primary">关于</li>
          </ol>
        </div>
      </div>
      {/* Header End */}

      {/* Banner Start */}
      <div className="container-fluid bg-secondary animate__animated animate__zoomInDown" data-wow-delay="0.1s">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center text-center p-5">
            <h1 className="me-4"><span className="fw-normal">加入我们今日，</span><span>赋能新一代全球青年领袖</span></h1>
            <a href="#" className="text-white fw-bold fs-2"><i className="fa fa-phone me-1"></i> +86 123-4567-890</a>
          </div>
        </div>
      </div>
      {/* Banner End */}

      {/* About Start */}
      <div className="container-fluid py-5 bg-light">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5 wow fadeInLeft" data-wow-delay="0.1s">
              <div className="border bg-secondary rounded">
                <Image src="/img/about-2.png" className="img-fluid w-100 rounded" alt="Image" width={500} height={500} />
              </div>
            </div>
            <div className="col-lg-7 wow fadeInRight" data-wow-delay="0.3s">
              <h4 className="text-secondary sub-title fw-bold">关于我们</h4>
              <h1 className="display-3 mb-4"><strong className="text-primary">全球视野</strong>, 培养具有全球视野的未来领袖</h1>
              <p className="text-dark">我们是一支总部位于香港的精英教育团队，致力于培养具有全球视野和批判性思维的中国青少年。通过双语全球议题讨论、香港及海外顶尖大学生导师辅导，以及企业参观和大师班等体验活动，帮助孩子们弥补传统学业的不足，塑造差异化升学优势和未来竞争力。我们的使命是培养自信、具国际视野的未来领袖，助力他们进入世界顶尖高校和职场。</p>
              <p className="mb-4 text-dark">我们致力于通过创新的教育方式，为青少年提供独特的成长机会。我们的课程结合前沿知识与实践经验，确保每位学员都能在全球化环境中脱颖而出。</p>
              <a className="btn btn-primary rounded-pill text-white py-3 px-5" href="#">了解更多</a>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}

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
                  <h4 className="text-secondary mb-0" style={{ fontWeight: 600, fontSize: '25px' }}>+</h4>
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
                  <h4 className="text-secondary mb-0" style={{ fontWeight: 600, fontSize: '25px' }}>+</h4>
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
                  <h4 className="text-secondary mb-0" style={{ fontWeight: 600, fontSize: '25px' }}>+</h4>
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
                  <h4 className="text-secondary mb-0" style={{ fontWeight: 600, fontSize: '25px' }}>+</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Counter Facts End */}

      {/* Team Start */}
      <div className="container-fluid team py-5 bg-light">
        <div className="container py-5">
          <div className="pb-5">
            <h4 className="text-secondary sub-title fw-bold wow fadeInUp" data-wow-delay="0.1s">舞蹈导师</h4>
            <h1 className="display-2 mb-0 wow fadeInUp" data-wow-delay="0.3s">我们的专业导师团队</h1>
          </div>
          <div className="team-carousel owl-carousel pt-5 wow fadeInUp" data-wow-delay="0.1s">
            <div className="team-item border rounded wow fadeInUp" data-wow-delay="0.1s">
              <div className="team-img bg-secondary rounded-top">
                <Image src="/img/team-1.jpg" className="img-fluid rounded-top w-100" alt="Image" width={400} height={400} />
                <div className="team-icon">
                  <a className="btn btn-square btn-primary rounded-circle mx-1" href=""><i className="fab fa-weixin"></i></a>
                  <a className="btn btn-square btn-primary rounded-circle mx-1" href=""><i className="fab fa-linkedin-in"></i></a>
                  <a className="btn btn-square btn-primary rounded-circle mx-1" href=""><i className="fab fa-weibo"></i></a>
                </div>
              </div>
              <div className="team-content text-center p-4">
                <a href="#" className="h4">李伟博士</a>
                <p className="mb-0 text-primary">项目总监</p>
                <p className="text-dark">香港大学毕业，教育战略专家</p>
              </div>
            </div>
            <div className="team-item border rounded wow fadeInUp" data-wow-delay="0.3s">
              <div className="team-img bg-secondary rounded-top">
                <Image src="/img/team-2.jpg" className="img-fluid rounded-top w-100" alt="Image" width={400} height={400} />
                <div className="team-icon">
                  <a className="btn btn-square btn-primary rounded-circle mx-1" href=""><i className="fab fa-weixin"></i></a>
                  <a className="btn btn-square btn-primary rounded-circle mx-1" href=""><i className="fab fa-linkedin-in"></i></a>
                  <a className="btn btn-square btn-primary rounded-circle mx-1" href=""><i className="fab fa-weibo"></i></a>
                </div>
              </div>
              <div className="team-content text-center p-4">
                <a href="#" className="h4">陈艾米</a>
                <p className="mb-0 text-primary">首席导师</p>
                <p className="text-dark">牛津大学毕业，国际关系专家</p>
              </div>
            </div>
            <div className="team-item border rounded wow fadeInUp" data-wow-delay="0.5s">
              <div className="team-img bg-secondary rounded-top">
                <Image src="/img/team-3.jpg" className="img-fluid rounded-top w-100" alt="Image" width={400} height={400} />
                <div className="team-icon">
                  <a className="btn btn-square btn-primary rounded-circle mx-1" href=""><i className="fab fa-weixin"></i></a>
                  <a className="btn btn-square btn-primary rounded-circle mx-1" href=""><i className="fab fa-linkedin-in"></i></a>
                  <a className="btn btn-square btn-primary rounded-circle mx-1" href=""><i className="fab fa-weibo"></i></a>
                </div>
              </div>
              <div className="team-content text-center p-4">
                <a href="#" className="h4">黄杰森</a>
                <p className="mb-0 text-primary">青少年心理教练</p>
                <p className="text-dark">常春藤联盟毕业，专注心理韧性与学习方法</p>
              </div>
            </div>
            <div className="team-item border rounded wow fadeInUp" data-wow-delay="0.7s">
              <div className="team-img bg-secondary rounded-top">
                <Image src="/img/team-4.jpg" className="img-fluid rounded-top w-100" alt="Image" width={400} height={400} />
                <div className="team-icon">
                  <a className="btn btn-square btn-primary rounded-circle mx-1" href=""><i className="fab fa-weixin"></i></a>
                  <a className="btn btn-square btn-primary rounded-circle mx-1" href=""><i className="fab fa-linkedin-in"></i></a>
                  <a className="btn btn-square btn-primary rounded-circle mx-1" href=""><i className="fab fa-weibo"></i></a>
                </div>
              </div>
              <div className="team-content text-center p-4">
                <a href="#" className="h4">Emily Ava</a>
                <p className="mb-0 text-primary">Instructor</p>
              </div>
            </div>
            <div className="team-item border rounded wow fadeInUp" data-wow-delay="0.9s">
              <div className="team-img bg-secondary rounded-top">
                <Image src="/img/team-4.jpg" className="img-fluid rounded-top w-100" alt="Image" width={400} height={400} />
                <div className="team-icon">
                  <a className="btn btn-square btn-primary rounded-circle mx-1" href=""><i className="fab fa-weixin"></i></a>
                  <a className="btn btn-square btn-primary rounded-circle mx-1" href=""><i className="fab fa-linkedin-in"></i></a>
                  <a className="btn btn-square btn-primary rounded-circle mx-1" href=""><i className="fab fa-weibo"></i></a>
                </div>
              </div>
              <div className="team-content text-center p-4">
                <a href="#" className="h4">Emily Ava</a>
                <p className="mb-0 text-primary">Instructor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Team End */}

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

      {/* Back to Top */}
      <a href="#" className="btn btn-primary btn-lg-square back-to-top"><i className="fa fa-arrow-up"></i></a>
    </>
  );
}