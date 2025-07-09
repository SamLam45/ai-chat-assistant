import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';
import Layout from '../../components/Layout';
import Papa from 'papaparse';

type AlumniCsvRow = {
  name: string;
  school: string;
  department: string;
  grade: string;
  education: string;
  experience?: string;
  interests?: string;
};

const INTEREST_OPTIONS = [
  'Learning English', 'Cantonese', 'Other languages', 'Female', 'Male',
  'Chinese Tutor', 'HK Local Tutor', 'Foreign Tutor', 'Art', 'Science', 'Sport'
];

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    school: '',
    department: '',
    grade: '',
    education: '',
    experience: '',
    interests: [] as string[],
  });
  const [submitMsg, setSubmitMsg] = useState('');
  const [csvMsg, setCsvMsg] = useState('');
  const [csvUploading, setCsvUploading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (profile?.role !== 'admin') {
        router.push('/student/dashboard'); 
      } else {
        setUser(user);
      }
    };
    
    checkUser();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleInterestChange = (option: string) => {
    let interests = form.interests || [];
    if (interests.includes(option)) {
      interests = interests.filter(i => i !== option);
    } else {
      if (interests.length < 10) {
        interests = [...interests, option];
      }
    }
    setForm({ ...form, interests });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitMsg('');
    const res = await fetch('/api/admin/add-alumni', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSubmitMsg('新增成功！');
      setForm({ name: '', school: '', department: '', grade: '', education: '', experience: '', interests: [] });
    } else {
      setSubmitMsg('新增失敗，請檢查資料或稍後再試。');
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvMsg('');
    setCsvUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as AlumniCsvRow[];
        let success = 0, fail = 0;
        for (const row of rows) {
          // 檢查必要欄位
          if (!row.name || !row.school || !row.department || !row.grade || !row.education) {
            fail++;
            continue;
          }
          const interests = row.interests ? row.interests.split(';').map(s => s.trim()).filter(Boolean) : [];
          const res = await fetch('/api/admin/add-alumni', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: row.name,
              school: row.school,
              department: row.department,
              grade: row.grade,
              education: row.education,
              experience: row.experience || '',
              interests,
            }),
          });
          if (res.ok) success++;
          else fail++;
        }
        setCsvMsg(`批次上傳完成，成功 ${success} 筆，失敗 ${fail} 筆`);
        setCsvUploading(false);
      },
      error: (err) => {
        setCsvMsg('CSV 解析失敗: ' + err.message);
        setCsvUploading(false);
      }
    });
  };

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
    <Layout title="管理后台">
        <div className="container-fluid py-5">
            <div className="container py-5">
                <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                    <h1 className="display-5 mb-5">管理后台</h1>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="bg-light rounded p-4 p-md-5 wow fadeInUp" data-wow-delay="0.3s">
                            <h4 className="mb-4">欢迎, {user.email}</h4>
                            <p>这里是管理仪表板。您可以在这里管理学生、课程等内容。</p>
                            <hr className="my-4" />
                            <h5 className="mb-3">新增學長資料</h5>
                            <form onSubmit={handleSubmit}>
                              <div className="mb-3">
                                <label className="form-label">姓名</label>
                                <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">畢業學校</label>
                                <input name="school" className="form-control" value={form.school} onChange={handleChange} required />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">科系</label>
                                <input name="department" className="form-control" value={form.department} onChange={handleChange} required />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">年級</label>
                                <input name="grade" className="form-control" value={form.grade} onChange={handleChange} required />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">學歷</label>
                                <input name="education" className="form-control" value={form.education} onChange={handleChange} required />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">經驗</label>
                                <textarea name="experience" className="form-control" value={form.experience} onChange={handleChange} />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">興趣／學術選擇（最多 10 項）</label>
                                <div className="d-flex flex-wrap gap-2">
                                  {INTEREST_OPTIONS.map(option => (
                                    <label key={option} className={`btn btn-outline-primary mb-2 ${form.interests.includes(option) ? 'active' : ''}`}
                                      style={{ minWidth: 120 }}>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        autoComplete="off"
                                        checked={form.interests.includes(option)}
                                        onChange={() => handleInterestChange(option)}
                                        disabled={!form.interests.includes(option) && form.interests.length >= 10}
                                      />
                                      {form.interests.includes(option) && <i className="bi bi-check-lg me-1"></i>}
                                      {option}
                                    </label>
                                  ))}
                                </div>
                                <div className="form-text">可多選，最多 10 項</div>
                              </div>
                              <button type="submit" className="btn btn-primary">新增學長</button>
                            </form>
                            {submitMsg && <div className="alert alert-info mt-3">{submitMsg}</div>}
                            <div className="mb-4">
                              <label className="form-label">或批次上傳 CSV , 請確認 CSV UTF-8 (逗號分隔) (.csv)</label>
                              <input type="file" accept=".csv" className="form-control" onChange={handleCsvUpload} disabled={csvUploading} />
                              {csvUploading && <div className="text-primary mt-2">上傳中，請稍候...</div>}
                              {csvMsg && <div className="alert alert-info mt-2">{csvMsg}</div>}
                            </div>
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

export default AdminDashboard; 