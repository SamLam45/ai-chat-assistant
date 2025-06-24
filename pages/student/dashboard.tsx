import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';
import Layout from '../../components/Layout';

const StudentDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
    };
    
    checkUser();
  }, [router]);

  if (!user) {
    return (
        <Layout title="载入中...">
            <div className="container-fluid py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </Layout>
    );
  }

  return (
    <Layout title="学生中心">
        <div className="container-fluid py-5">
            <div className="container py-5">
                <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                    <h1 className="display-5 mb-5">学生中心</h1>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="bg-light rounded p-4 p-md-5 wow fadeInUp" data-wow-delay="0.3s">
                            <h4 className="mb-4">欢迎, {user.email}</h4>
                            <p>这里是您的学生中心。您可以在这里查看您的课程、作业和进度。</p>
                            <button 
                                className="btn btn-danger rounded-pill text-white py-3 px-5 mt-4"
                                onClick={async () => {
                                    await supabase.auth.signOut();
                                    router.push('/login');
                                }}
                            >
                                登出
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  );
};

export default StudentDashboard; 