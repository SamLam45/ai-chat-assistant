import Head from "next/head";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";
import "animate.css";
import Link from "next/link";
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AboutProps {
  user: User | null;
}

export default function About({ user }: AboutProps) {
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
        <title>全球视野 - 关于我们</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta content="全球视野, 青少年培训, 精英教育, 国际视野, 香港导师" name="keywords" />
        <meta content="通过专属国际视野培训项目，激发中国青少年潜能，培养未来全球领袖。" name="description" />
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
                <button className="btn btn-outline-primary px-4 fw-bold" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  個人檔案
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
          <h3 className="text-primary display-3 animate__animated animate__fadeInDown" data-wow-delay="0.1s">
            关于我们
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
            <li className="breadcrumb-item active text-primary">关于</li>
          </ol>
        </div>
      </div>
      {/* Header End */}

      {/* Banner Start */}
      <div className="container-fluid animate__animated animate__zoomInDown" data-wow-delay="0.1s" style={{ backgroundColor: '#f28b00' }}>
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

      {/* About Start */}
      <div className="container-fluid py-5 bg-light">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5 wow fadeInLeft" data-wow-delay="0.1s">
              <div className="border rounded" style={{ backgroundColor: '#f28b00' }}>
                <Image src="/img/teaching-about-1.jpg" className="img-fluid w-100 rounded" alt="教師教導學生" width={500} height={500} />
              </div>
            </div>
            <div className="col-lg-7 wow fadeInRight" data-wow-delay="0.3s">
              <h4 className="sub-title fw-bold" style={{ color: '#f28b00' }}>
                關於我們
              </h4>
              <h1 className="display-3 mb-4">
                <strong className="text-primary">M — Motivating（激勵）：</strong>激勵學生主動學習<br/>
                <strong className="text-primary">I — Inspiring（啟發）：</strong>啟發學生發揮潛能<br/>
                <strong className="text-primary">G — Growing（成長）：</strong>陪伴學生持續成長
              </h1>
              <p className="text-dark">
                MIG成立於2017年，是一家專注於教育及職業發展的精英教育團隊。我們致力於為全球客戶提供專業、全面且貼心的升學、留學及就業規劃服務。<br/>
                我們的核心服務涵蓋：升學及留學顧問、移民與簽證申請、語言培訓、學歷認證、職業規劃與海外就業支援等。透過雙語全球議題討論、香港及海外頂尖大學生導師輔導，以及企業參觀和大師班等體驗活動，幫助孩子們彌補傳統學業的不足，塑造差異化升學優勢和未來競爭力。團隊成員均具備豐富的行業經驗，並與多所國際頂尖學府、移民機構、語言中心、地產與人力資源機構建立了穩固的合作網絡。<br/>
                我們秉持「以客為本、量身訂做」的理念，為每位客戶打造最合適的發展路徑，協助他們實現人生目標。我們的使命是培養自信、具國際視野的未來領袖，協助他們進入世界頂尖大學和職場。無論您是計劃赴澳洲、美國、加拿大、星加坡、日本等地升學或就業，MIG都能成為您值得信賴的夥伴。<br/>
                我們致力於透過創新的教育方式，為青少年提供獨特的成長機會。我們的課程結合前沿知識與實務經驗，確保每位學員都能在全球化環境中脫穎而出。
              </p>
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
                  <h4 className="mb-0" style={{ fontWeight: 600, fontSize: '25px', color: '#f28b00' }}>
                    +
                  </h4>
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
                  <h4 className="mb-0" style={{ fontWeight: 600, fontSize: '25px', color: '#f28b00' }}>
                    +
                  </h4>
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
                  <h4 className="mb-0" style={{ fontWeight: 600, fontSize: '25px', color: '#f28b00' }}>
                    +
                  </h4>
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
                  <h4 className="mb-0" style={{ fontWeight: 600, fontSize: '25px', color: '#f28b00' }}>
                    +
                  </h4>
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
            <h4 className="sub-title fw-bold wow fadeInUp team-orange" data-wow-delay="0.1s" style={{ color: '#f28b00' }}>团队介绍</h4>
            <h1 className="display-2 mb-0 wow fadeInUp" data-wow-delay="0.3s">我们的精英导师团队</h1>
          </div>
          <div className="team-carousel owl-carousel pt-5 wow fadeInUp" data-wow-delay="0.1s">
            {[
              { name: '陳大文', title: '香港大學', desc: '香港大学毕业，計算機科學系', img: 'team-1.jpg' },
              { name: '王小明', title: '台灣大學', desc: '台灣大學毕业，電機系', img: 'team-2.jpg' },
              { name: '張志明', title: '香港科技大學', desc: '電機工程系', img: 'team-3.jpg' }
            ].map((member, idx) => (
              <div
                className="team-item border rounded wow fadeInUp"
                data-wow-delay={`${0.1 + idx*0.2}s`}
                key={idx}
                style={{ cursor: 'pointer' }}
                onClick={() => window.location.href = '/login'}
              >
                <div className="team-img team-orange-bg rounded-top">
                  <Image
                      src={`/img/${member.img}`}
                      className="img-fluid rounded-top w-100"
                      alt={member.name}
                      width={400}
                      height={400}
                    />
                  <div className="team-icon">
                    <a className="btn btn-square btn-primary rounded-circle mx-1" href="#"><i className="fab fa-weixin"></i></a>
                    <a className="btn btn-square btn-primary rounded-circle mx-1" href="#"><i className="fab fa-linkedin-in"></i></a>
                    <a className="btn btn-square btn-primary rounded-circle mx-1" href="#"><i className="fab fa-weibo"></i></a>
                  </div>
                </div>
                <div className="team-content text-center p-4">
                  <span className="h4">{member.name}</span>
                  <p className="mb-0 text-primary">{member.title}</p>
                  <p className="text-dark">{member.desc}</p>
                </div>
              </div>
            ))}
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