import Head from 'next/head';
import Image from 'next/image';
import { useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';
import 'animate.css';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface HomeProps {
  user: User | null;
}

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

export default function Home({ user }: HomeProps) {
  const router = useRouter();

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
        <title>AI 大學 Matching</title>
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

      {/* Carousel Start */}
      <div className="header-carousel owl-carousel">
        <div className="header-carousel-item">
          <Image
            src="/img/teaching-1.jpg"
            className="img-fluid w-100 warm-filter"
            alt="教师教导学生"
            width={1920}
            height={1080}
            priority
          />
          <div className="carousel-caption">
            <div className="carousel-caption-content p-3" style={{ maxWidth: '900px' }}>
              <h4 id="subtitle" className="text-uppercase sub-title fw-bold mb-4 wow animate__animated animate__fadeInUp" data-wow-delay="0.2s" style={{ letterSpacing: '3px', color: '#f28b00' }}>通过专属国际视野培训项目，激发孩子潜能</h4>
              <h1 id="main-title" className="display-1 text-capitalize text-white mb-4 wow animate__animated animate__fadeInUp" data-wow-delay="0.4s">赋能新一代全球青年领袖</h1>
              <p id="main-desc" className="fs-5 wow animate__animated animate__fadeInUp" data-wow-delay="0.6s">线上授课，精英导师，真实体验，助力孩子成为具有国际视野的未来领袖。</p>
              <div className="pt-2">
                <Link href="#" className="btn btn-primary rounded-pill text-white py-3 px-5 m-2 wow animate__animated animate__fadeInLeft" data-wow-delay="0.1s">立即报名</Link>
                {user && (
                  <Link href="#" className="btn rounded-pill text-white py-3 px-5 m-2 wow animate__animated animate__fadeInUp" data-wow-delay="0.2s" style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}>
                    <i className="fas fa-robot me-2"></i>开始使用AI助手
                  </Link>
                )}
                <Link href="#" className="btn rounded-pill text-white py-3 px-5 m-2 wow animate__animated animate__fadeInRight" data-wow-delay="0.3s" style={{ backgroundColor: '#f28b00', borderColor: '#f28b00' }}>下载课程手册</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Carousel End */}

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
              <h4 className="sub-title fw-bold" style={{ color: '#f28b00', letterSpacing: '2px', marginBottom: '1rem' }}>
                關於我們
              </h4>
              <div style={{ borderTop: '2px solid #f28b00', width: '60px', marginBottom: '1.5rem' }}></div>
              <div style={{ lineHeight: 1.2, marginBottom: '2rem' }}>
                <span style={{ color: '#1976d2', fontWeight: 700, fontSize: '2.8rem', display: 'block' }}>
                  M <span style={{ fontSize: '2rem', fontWeight: 400 }}> Motivating（激勵）</span>：
                </span>
                <span style={{ fontSize: '1.6rem', display: 'block', marginBottom: '1.2rem' }}>激勵學生主動學習</span>
                <span style={{ color: '#1976d2', fontWeight: 700, fontSize: '2.8rem', display: 'block' }}>
                  I <span style={{ fontSize: '2rem', fontWeight: 400 }}> Inspiring（啟發）</span>：
                </span>
                <span style={{ fontSize: '1.6rem', display: 'block', marginBottom: '1.2rem' }}>啟發學生發揮潛能</span>
                <span style={{ color: '#1976d2', fontWeight: 700, fontSize: '2.8rem', display: 'block' }}>
                  G <span style={{ fontSize: '2rem', fontWeight: 400 }}> Growing（成長）</span>：
                </span>
                <span style={{ fontSize: '1.6rem', display: 'block', marginBottom: '1.2rem' }}>陪伴學生持續成長</span>
              </div>
              <p className="text-dark" style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
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

      {/* Services Start */}
      <div className="container-fluid training bg-white py-5">
        <div className="container py-5">
          <div className="pb-5">
            <div className="row g-4 align-items-end">
              <div className="col-xl-8">
                <h4 className="sub-title fw-bold wow fadeInUp" data-wow-delay="0.1s" style={{ color: '#f28b00' }}>服务项目</h4>
                <h1 className="display-2 mb-0 wow fadeInUp" data-wow-delay="0.3s">全球视野新一代精英少年培训计划</h1>
              </div>
               <div className="col-xl-4 text-xl-end wow fadeInUp" data-wow-delay="0.3s">
                <a className="btn btn-primary rounded-pill text-white py-3 px-5" href="#">查看所有课程</a>
              </div>
            </div>
          </div>
          <div className="training-carousel owl-carousel pt-5 wow fadeInUp" data-wow-delay="0.1s">
            {[
              { img: 'teaching-3', title: '升學及留學顧問服務', desc: '提供個人化升學規劃建議，包括學校選擇、申請流程、面試技巧，同時協助申請海外大學，適合計劃出國升學嘅學生及家庭。' },
              { img: 'teaching-4', title: '職涯規劃與就業支援', desc: '為學生及年青人提供職涯諮詢、職場參觀、實習機會配對、履歷優化及面試培訓，幫助客戶提升未來就業競爭力。' },
              { img: 'teaching-5', title: '語言培訓與學術輔導', desc: '開設多語言課程及學術補習（如英語、普通話、專科補習），結合線上線下教學，提升語言能力同學術成績。' },
              { img: 'teaching-6', title: '移民與簽證申請服務', desc: '一站式協助辦理海外升學相關簽證、移民文件，提供專業顧問解答及文件審查，減低申請風險。' },
              { img: 'teaching-7', title: '學歷認證及專業發展課程', desc: '協助學員申請學歷認證，推廣持續進修，亦提供職場技能提升課程（如簡報技巧、團隊合作、領導力發展等）。' }
            ].map((item, idx) => (
              <div className="training-item bg-white rounded wow fadeInUp" data-wow-delay={`${0.1 + idx*0.2}s`} key={idx}>
                <div className="training-img rounded-top">
                    <Image
                      src={`/img/teaching-training-${idx+1}.jpg`}
                      className="img-fluid rounded-top w-100"
                      alt="服务图片"
                      width={600}
                      height={400}
                    />
                  <h1 className="fs-1 fw-bold bg-primary text-white d-inline-block rounded p-2 position-absolute" style={{top: 0, left: 0}}>{`0${idx+1}`}</h1>
                </div>
                <div className="rounded-bottom border border-top-0 p-4">
                  <a href="#" className="h4 mb-3 d-block">{item.title}</a>
                  <p className="mb-3 text-dark">{item.desc}</p>
                  <a className="btn btn-primary rounded-pill text-white py-2 px-4" href="#">了解详情</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Services End */}

      {/* Why Choose Us Start */}
      <div className="container-fluid py-5 bg-light">
        <div className="container py-5">
          <div className="pb-5">
            <h4 className="sub-title fw-bold wow fadeInUp" data-wow-delay="0.1s" style={{ color: '#f28b00' }}>项目特色</h4>
            <h1 className="display-2 mb-0 wow fadeInUp" data-wow-delay="0.3s">为什么选择我们</h1>
          </div>
          <div className="row g-4">
            {[
              { title: '一站式全方位規劃', desc: '我們提供升學、留學、語言、職涯、移民等全方位服務，一個平台滿足你所有需求，節省時間又放心。' },
              { title: '專業團隊 豐富經驗', desc: '顧問團隊擁有多年行業經驗，熟悉本地與海外教育資源，為你提供業界最專業貼心的建議。' },
              { title: '量身訂造 個性化方案', desc: '根據每位學員不同興趣、能力與規劃，設計最合適的升學及發展路徑，助你脫穎而出。' },
              { title: '全球網絡 海量資源', desc: '與多間世界頂尖學府、專業機構建立合作關係，持續掌握最新升學與職涯趨勢，提供最前沿選擇。' },
              { title: '持續支援 陪伴成長', desc: '不止一次性服務，我們重視長遠發展，從規劃到適應全程陪伴，助你順利過渡人生各階段。' },
              { title: '便捷高效的教學模式', desc: '以線上授課為主，靈活配合學生時間安排，減少頻繁線下奔波，提升學習效率。同時定期舉辦高端線下沙龍及實體活動，讓學生保持真實交流與人脈拓展，實現線上線下教學的最佳結合。' }
            ].map((item, idx) => (
              <div className="col-md-6 col-lg-4 wow fadeInUp" data-wow-delay={`${0.1 + idx*0.2}s`} key={idx}>
                <div className="bg-white rounded p-4">
                  <h5 className="mb-3">{item.title}</h5>
                  <p className="text-dark">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Why Choose Us End */}

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
                <img src="/img/teaching-blog-1.jpg" className="img-fluid rounded-top w-100" alt="教师教导学生" />
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
                <img src="/img/teaching-blog-2.jpg" className="img-fluid rounded-top w-100" alt="教师教导学生" />
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
                <img src="/img/teaching-blog-3.jpg" className="img-fluid rounded-top w-100" alt="教师教导学生" />
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


            {/* Testimonial Start */}
      <div className="container-fluid testimonial bg-light py-5">
        <div className="container py-5">
          <div className="pb-5">
            <h4 className="sub-title fw-bold wow fadeInUp" data-wow-delay="0.1s" style={{ color: '#f28b00' }}>我们的学员评价</h4>
            <h1 className="display-2 mb-0 wow fadeInUp" data-wow-delay="0.3s">学员的真实反馈</h1>
          </div>
          <div className="owl-carousel testimonial-carousel pt-5 wow fadeInUp" data-wow-delay="0.2s">
            {[1, 2, 3, 3].map((num, idx) => (
              <div className="testimonial-item border text-center rounded" key={idx}>
                <div className="rounded-circle position-absolute" style={{ width: 100, height: 100, top: 25, left: '50%', transform: 'translateX(-50%)' }}>
                      <Image
                        className="img-fluid rounded-circle"
                        src={`/img/testimonial-${num}.jpg`}
                        alt="img"
                        width={100}
                        height={100}
                      />
                </div>
                <div className="position-relative" style={{ marginTop: 140 }}>
                  <h5 className="mb-0">{idx === 0 ? '张女士' : idx === 1 ? 'Kevin L.' : 'Kevin L.'}</h5>
                  <p>{idx === 0 ? '家长' : '学员'}</p>
                  <div className="d-flex justify-content-center">
                    <i className="fas fa-star" style={{ color: '#f28b00' }}></i>
                    <i className="fas fa-star" style={{ color: '#f28b00' }}></i>
                    <i className="fas fa-star" style={{ color: '#f28b00' }}></i>
                    <i className="fas fa-star" style={{ color: '#f28b00' }}></i>
                    <i className="fas fa-star" style={{ color: '#f28b00' }}></i>
                  </div>
                </div>
                <div className="testimonial-content p-4">
                  <p className="fs-5 mb-0 text-dark">
                    {idx === 0 ? '导师的陪伴让我的女儿不仅英语提升明显，更学会了多角度思考世界。这个项目让她更有信心申请海外名校。' :
                     idx === 1 ? '小班制和同龄导师让学习变得有趣，尤其喜欢关于AI和国际政治的讨论，这些学校里学不到。' :
                     '小班制和同龄导师让学习变得有趣，尤其喜欢关于AI和国际政治的讨论，这些学校里学不到。'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Testimonial End */}


      {/* Contact Start */}
      <div className="container-fluid py-5 bg-light">
        <div className="container py-5">
          <div className="pb-5">
            <h4 className="sub-title fw-bold wow fadeInUp" data-wow-delay="0.1s" style={{ color: '#f28b00' }}>联系我们</h4>
            <h1 className="display-2 mb-0 wow fadeInUp" data-wow-delay="0.3s">如有疑问或报名</h1>
          </div>
          <div className="row g-5">
            <div className="col-lg-6 wow fadeInLeft" data-wow-delay="0.1s">
              <div className="bg-white rounded p-4">
                <p className="text-dark mb-4">请填写以下信息，我们将尽快与您联系：</p>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="姓名" />
                </div>
                <div className="mb-3">
                  <input type="email" className="form-control" placeholder="邮箱" />
                </div>
                <div className="mb-3">
                  <textarea className="form-control" rows={4} placeholder="留言"></textarea>
                </div>
                <button className="btn btn-primary rounded-pill text-white py-2 px-4">提交</button>
              </div>
              <div className="mt-4">
                <p className="text-dark"><i className="fas fa-phone-alt text-primary me-2"></i>电话：+86 123-4567-890</p>
                <p className="text-dark"><i className="fas fa-envelope text-primary me-2"></i>邮箱：<a href="mailto:info@globalvisionelite.com">info@globalvisionelite.com</a></p>
                <p className="text-dark"><i className="fas fa-map-marker-alt text-primary me-2"></i>地址：香港中环教育大厦18楼</p>
              </div>
            </div>
            <div className="col-lg-6 wow fadeInRight" data-wow-delay="0.3s">
              <div className="ratio ratio-16x9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.589038837231!2d114.15483331500122!3d22.283418985330973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3404006509b3b7b7%3A0x4f7e2b0b8f9f7e1a!2sCentral%2C%20Hong%20Kong!5e0!3m2!1sen!2s!4v1634567890123"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                ></iframe>
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
                <a href="#" className="footer-link">团队介绍</a>
                <a href="#" className="footer-link">学员评价</a>
                <a href="#" className="footer-link">博客资讯</a>
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