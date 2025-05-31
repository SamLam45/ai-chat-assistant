import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../../types/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error:', error.message);
      }
      router.push('/');
    };

    handleAuthCallback();
  }, [router, supabase.auth]);

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 text-center">
            <h2>处理中...</h2>
            <p>请稍候，我们正在验证您的邮箱。</p>
          </div>
        </div>
      </div>
    </div>
  );
} 