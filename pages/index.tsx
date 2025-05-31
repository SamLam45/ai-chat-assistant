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
          <a href="#" className="navbar-brand p-0">
            <h1 className="text-primary m-0"><i className="fas fa-globe me-3"></i>全球视野</h1>
          </a>
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

      {/* About Start */}
      <div className="container-fluid py-5 bg-light">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5 wow fadeInLeft" data-wow-delay="0.1s">
              <div className="border rounded" style={{ backgroundColor: '#f28b00' }}>
                <Image src="/img/teaching-about-1.jpg" className="img-fluid w-100 rounded" alt="教师教导学生" width={500} height={500} />
              </div>
            </div>
            <div className="col-lg-7 wow fadeInRight" data-wow-delay="0.3s">
              <h4 className="sub-title fw-bold" style={{ color: '#f28b00' }}>关于我们</h4>
              <h1 className="display-3 mb-4">培养具有全球视野的未来领袖</h1>
              <p className="text-dark">我们是一支总部位于香港的精英教育团队，致力于培养具有全球视野和批判性思维的中国青少年。通过双语全球议题讨论、香港及海外顶尖大学生导师辅导，以及企业参观和大师班等体验活动，帮助孩子们弥补传统学业的不足，塑造差异化升学优势和未来竞争力。我们的使命是培养自信、具国际视野的未来领袖，助力他们进入世界顶尖高校和职场。</p>
              <a className="btn btn-primary rounded-pill text-white py-3 px-5" href="#">了解更多</a>
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
              { img: 'teaching-3', title: '沉浸式课程', desc: '12个月课程，每月围绕AI、国际关系等12大主题展开' },
              { img: 'teaching-4', title: '精英导师辅导', desc: '香港及海外顶尖大学生1对2小组辅导，非大班网课' },
              { img: 'teaching-5', title: '双语教学', desc: '结合新闻分析与批判性思维训练，全面提升能力' },
              { img: 'teaching-6', title: '高端体验', desc: '独家企业参观、名师大师班及一线城市高端沙龙' },
              { img: 'teaching-7', title: '国际认证', desc: '结业颁发香港精英教育机构认证的国际素养证书' }
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
              { title: '同龄榜样力量', desc: '18-25岁顶尖留学生导师，经历过中高考及海外申请，能精准解答学员困惑' },
              { title: '全方位成长', desc: '学业辅导、心理支持与国际视野培养三位一体' },
              { title: '显著效果', desc: '82%学员因导师影响主动制定学习计划，亲子沟通冲突减少60%' },
              { title: '便捷高效', desc: '线上授课为主，减少频繁线下奔波，配合高端线下沙龙' },
              { title: '独特课程内容', desc: '探讨AI时代职业变革、中美贸易等前沿话题，培养未来竞争力' }
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

    {/* Team Start */}
      <div className="container-fluid team py-5 bg-light">
        <div className="container py-5">
          <div className="pb-5">
            <h4 className="sub-title fw-bold wow fadeInUp team-orange" data-wow-delay="0.1s" style={{ color: '#f28b00' }}>团队介绍</h4>
            <h1 className="display-2 mb-0 wow fadeInUp" data-wow-delay="0.3s">我们的精英导师团队</h1>
          </div>
          <div className="team-carousel owl-carousel pt-5 wow fadeInUp" data-wow-delay="0.1s">
            {[
              { name: '李伟博士', title: '项目总监', desc: '香港大学毕业，教育战略专家', img: 'team-1.jpg' },
              { name: '陈艾米', title: '首席导师', desc: '牛津大学毕业，国际关系专家', img: 'team-2.jpg' },
              { name: '黄杰森', title: '青少年心理教练', desc: '常春藤联盟毕业，专注心理韧性与学习方法', img: 'team-3.jpg' }
            ].map((member, idx) => (
              <div className="team-item border rounded wow fadeInUp" data-wow-delay={`${0.1 + idx*0.2}s`} key={idx}>
                <div className="team-img team-orange-bg rounded-top">
                  <Image
                      src={`/img/${member.img}`}
                      className="img-fluid rounded-top w-100"
                      alt={member.name}
                      width={400}
                      height={400}
                    />
                  <div className="team-icon">
                    <a className="btn btn-square btn-primary rounded-circle mx-1" href=""><i className="fab fa-weixin"></i></a>
                    <a className="btn btn-square btn-primary rounded-circle mx-1" href=""><i className="fab fa-linkedin-in"></i></a>
                    <a className="btn btn-square btn-primary rounded-circle mx-1" href=""><i className="fab fa-weibo"></i></a>
                  </div>
                </div>
                <div className="team-content text-center p-4">
                  <a href="#" className="h4">{member.name}</a>
                  <p className="mb-0 text-primary">{member.title}</p>
                  <p className="text-dark">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Team End */}


            {/* Blog Start */}
      <div className="container-fluid blog py-5 bg-white">
        <div className="container py-5">
          <div className="pb-5">
            <h4 className="sub-title fw-bold wow fadeInUp" data-wow-delay="0.1s" style={{ color: '#f28b00' }}>最新博客 / 新闻</h4>
            <h1 className="display-2 mb-0 wow fadeInUp" data-wow-delay="0.3s">前沿资讯与见解</h1>
          </div>
          <div className="blog-carousel owl-carousel pt-5 wow fadeInUp" data-wow-delay="0.1s">
            {[
              { title: 'AI如何改变未来职业：学生必备知识', img: 'class-1.jpg', date: '2025年5月20日' },
              { title: '跨文化沟通技巧，助力留学成功', img: 'class-2.jpg', date: '2025年5月15日' },
              { title: '导师分享：如何平衡学习与心理健康', img: 'class-3.jpg', date: '2025年5月10日' }
            ].map((post, idx) => (
              <div className="blog-item bg-white rounded wow fadeInUp" data-wow-delay={`${0.1 + idx*0.2}s`} key={idx}>
                <div className="blog-img rounded-top">
                  <Image
                    src={`/img/${post.img}`}
                    className="img-fluid rounded-top w-100"
                    alt="博客图片"
                    width={600}
                    height={400}
                  />  
                </div>
                <div className="bg-light rounded-bottom p-4">
                  <div className="d-flex justify-content-between mb-4">
                    <a href="#" className="text-muted"><i className="fa fa-calendar-alt text-primary"></i> {post.date}</a>
                    <a href="#" className="text-muted"><span className="fa fa-comments text-primary"></span> 3 条评论</a>
                  </div>
                  <a href="#" className="h4 mb-3 d-block">{post.title}</a>
                  <p className="mb-3 text-dark">了解更多关于{post.title.toLowerCase()}的最新见解。</p>
                  <a className="btn btn-primary rounded-pill text-white py-2 px-4" href="#">阅读全文</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Blog End */}

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