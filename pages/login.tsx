import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import Layout from '../components/Layout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 檢查用戶是否已登入
    supabase.auth.getUser().then(({ data }) => {
      // Do not redirect here, let the other effect handle it
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

  // Effect to redirect user if logged in
  useEffect(() => {
    if (user) {
      setIsRedirecting(true);
      const getProfileAndRedirect = async () => {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError || !profile) {
          setError('获取用户信息失败，请联系管理员。');
          await supabase.auth.signOut();
          setIsRedirecting(false);
          return;
        }

        if (profile.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      };
      getProfileAndRedirect();
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // The useEffect hooks now handle redirection.
      // No need to do anything here after successful login.

    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || '登录时发生错误，请稍后重试');
      } else {
        setError('登录时发生错误，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      setInfo('注册成功，请前往邮箱点击确认链接完成注册。');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || '注册时发生错误，请稍后重试');
      } else {
        setError('注册时发生错误，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setInfo(null);
    setError(null);
    // router.push('/'); // 可選：登出後導回首頁
  };

  if (isRedirecting) {
    return (
        <Layout title="跳转中...">
            <div className="container-fluid py-5 text-center" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Redirecting...</span>
                    </div>
                    <p className="mt-3 fs-5">登录成功，正在跳转...</p>
                </div>
            </div>
        </Layout>
    );
  }

  return (
    <Layout title="登录/注册">
      {/* Login Form Start */}
      <div className="container-fluid py-5 bg-light">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="bg-white rounded p-4 p-md-5 wow fadeInUp" data-wow-delay="0.1s">
                <h2 className="text-center mb-4">登录/注册</h2>
                {user ? (
                  <>
                    <div className="alert alert-success text-center" role="alert">
                      已登入：{user.email}
                    </div>
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-danger rounded-pill text-white py-3 px-5"
                        onClick={handleLogout}
                      >
                        登出
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    {info && (
                      <div className="alert alert-info" role="alert">
                        {info}
                      </div>
                    )}
                    <form onSubmit={handleLogin}>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">邮箱</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">密码</label>
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>

                      <div className="d-grid gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary rounded-pill text-white py-3 px-5"
                          disabled={loading}
                        >
                          {loading ? '处理中...' : '登录'}
                        </button>
                        <button
                          type="button"
                          className="btn rounded-pill text-white py-3 px-5"
                          onClick={handleSignUp}
                          disabled={loading}
                          style={{ backgroundColor: '#f28b00', borderColor: '#f28b00' }}
                        >
                          {loading ? '处理中...' : '注册新账号'}
                        </button>
                      </div>
                    </form>
                  </>
                )}
                <div className="text-center mt-4">
                  <Link href="/" className="text-decoration-none">
                    返回首页
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Login Form End */}
    </Layout>
  );
} 