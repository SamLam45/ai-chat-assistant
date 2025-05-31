import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Head from 'next/head'
import Link from 'next/link'
import { AuthError } from '@supabase/supabase-js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        router.push('/') // Redirect to home page after successful login
      }
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        setError('Please check your email for verification link')
      }
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>登录 - 全球视野</title>
        <meta name="description" content="登录到全球视野新一代精英少年培训计划" />
      </Head>

      <div className="container-fluid py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="bg-white rounded p-4 shadow">
                <h2 className="text-center mb-4">登录 / 注册</h2>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
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
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? '处理中...' : '登录'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handleSignUp}
                      disabled={loading}
                    >
                      {loading ? '处理中...' : '注册新账号'}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-3">
                  <Link href="/" className="text-decoration-none">
                    返回首页
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 