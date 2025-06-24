import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AdminDashboardProps {
  user: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>管理員儀表板</h1>
        <button onClick={handleLogout} className="btn btn-danger">登出</button>
      </div>
      <div className="alert alert-success" role="alert">
        <h4 className="alert-heading">歡迎, {user.email}!</h4>
        <p>這裡是管理員專屬的操作後台。</p>
        <hr />
        <p className="mb-0">你的用戶 ID 是: {user.id}</p>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const { data: { user } } = await supabase.auth.getUser(req.cookies['supabase-auth-token']);

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return {
      redirect: {
        destination: '/student/dashboard', // or to a generic unauthorized page
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
}; 