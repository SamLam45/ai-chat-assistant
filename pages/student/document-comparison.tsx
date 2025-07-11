import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout'; // Assuming a Layout component exists
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';

interface RequirementData {
    formData: {
      jobTitle: string;
      jobDescription: string;
      email?: string;
      school: string;
      department: string;
      grade: string;
      experienceRequirements: string;
      educationRequirements: string;
      additionalNotes: string;
      interests?: string[];
      otherLanguage?: string;
      specialWish?: string;
      phone?: string; // Added phone field
      nameEn?: string; // Added nameEn field
    };
    requiredSkills: string[];
    preferredSkills: string[];
    weights: {
      skills: number;
      experience: number;
      education: number;
    };
    aiSummary?: string;
  }

type AlumniType = {
  id: string;
  name: string;
  school: string;
  department: string;
  grade: string;
  education: string;
  experience: string;
  skills: string[];
  resume_content: string;
  distance?: number;
};

// Step 1: Upload Resumes Component
// 移除 UploadStep
// 移除 setUploadedFiles

// Step 3: Saved Requirements Component
const SavedRequirementsStep = ({ requirements, onEdit, onSubmit, isSubmitting, submissionError, aiSummaryLoading }: { 
    requirements: RequirementData | null, 
    onEdit: () => void, 
    onSubmit: () => void,
    isSubmitting: boolean,
    submissionError: string | null,
    aiSummaryLoading?: boolean
}) => {
    if (aiSummaryLoading) {
        return (
            <div className="alert alert-info mb-4 text-center">
                <span className="spinner-border spinner-border-sm me-2"></span>
                AI 正在整理摘要...
            </div>
        );
    }
    if (!requirements) {
        return (
            <div className="text-center">
                <p className="text-muted">您尚未建立期望要求。</p>
                <p>請先返回第二步填寫您的期望要求。</p>
            </div>
        );
    }

    const { formData } = requirements;

    return (
        <div>
            {aiSummaryLoading ? (
              <div className="alert alert-info mb-4 text-center">
                <span className="spinner-border spinner-border-sm me-2"></span>
                AI 正在整理摘要...
              </div>
            ) : requirements?.aiSummary && (
              <div className="alert alert-info mb-4">
                <strong>AI 摘要：</strong>{requirements.aiSummary}
              </div>
            )}
            <h4 className="mb-4 text-center">✅ 確認您的個人資料</h4>
            <p className="text-center text-muted mb-4">請確認以下資訊，若有誤請返回上一步修改。</p>

            <div className="card mb-4 shadow-sm">
                <div className="card-body p-4">
                    <h6 className="mb-3"><i className="bi bi-person-badge me-2 text-primary"></i>個人資訊</h6>
                    <ul className="list-group">
                        <li className="list-group-item"><strong>姓名：</strong>{formData.jobTitle || '未填寫'}</li>
                        <li className="list-group-item"><strong>電郵地址：</strong>{formData.email || '未填寫'}</li>
                        <li className="list-group-item"><strong>學校：</strong>{formData.school || '未填寫'}</li>
                        <li className="list-group-item"><strong>學系：</strong>{formData.department || '未填寫'}</li>
                        <li className="list-group-item"><strong>年級：</strong>{formData.grade || '未填寫'}</li>
                        <li className="list-group-item"><strong>學歷：</strong>{formData.educationRequirements || '未填寫'}</li>
                    </ul>
                    <div className="form-text mt-2">此資料來自AI自動分析，您可於上一步修改。</div>
                </div>
            </div>
            {/* 興趣／學術選擇顯示區塊 */}
            {formData.interests && formData.interests.length > 0 && (
              <div className="card mb-4 shadow-sm">
                <div className="card-body p-4">
                  <h6 className="mb-3"><i className="bi bi-star me-2 text-primary"></i>興趣／學術選擇</h6>
                  <ul className="list-group">
                    {formData.interests.map((interest, idx) => (
                      <li className="list-group-item" key={idx}>
                        {interest === 'Other languages' && formData.otherLanguage
                          ? `其他語言：${formData.otherLanguage}`
                          : interest}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {/* 特殊需求／願望顯示區塊 */}
            {formData.specialWish && (
              <div className="card mb-4 shadow-sm">
                <div className="card-body p-4">
                  <h6 className="mb-3"><i className="bi bi-heart me-2 text-danger"></i>特殊需求／願望</h6>
                  <div className="list-group-item">{formData.specialWish}</div>
                </div>
              </div>
            )}

            {submissionError && (
                <div className="alert alert-danger mt-3">
                    {submissionError}
                </div>
            )}

            <div className="d-flex justify-content-end mt-4">
                <button className="btn btn-outline-secondary me-3" onClick={onEdit} disabled={isSubmitting}>
                    <i className="bi bi-pencil-square me-2"></i>返回修改
                </button>
                <button className="btn btn-primary" onClick={onSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            遞交中...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-check-circle-fill me-2"></i>確認遞交
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

// Step 2: Job Requirements Component
const RequirementsStep = ({ formData, setFormData, onFormSubmit }: { formData: RequirementData['formData'], setFormData: (formData: RequirementData['formData']) => void, onFormSubmit: (data: RequirementData) => void }) => {
    // Debug log
    console.log('RequirementsStep formData:', formData);

    const INTEREST_OPTIONS: string[] = [
      'Learning English',
      'Cantonese',
      'Female Tutor',
      'Male Tutor',
      'Chinese Tutor',
      'HK Local Tutor',
      'Foreign Tutor',
      'Art - Painting',
      'Art - Sculpture',
      'Art - Digital Art',
      'Science - Biology',
      'Science - Chemistry',
      'Science - Physics',
      'Sport - Swimming',
      'Sport - Basketball',
      'Sport - Yoga',
      'Music Instruments - Piano',
      'Music Instruments - Guitar',
      'Music Instruments - Erhu',
      'Computers - Programming',
      'Computers - Cybersecurity',
      'Computers - Data Analysis',
      'ChatGPT',
      'Grok 3 Usage',
      'AI Drawing',
      'Photography',
      'Creative Writing',
      'Robotics',
      'Digital Marketing',
      'Public Speaking',
      'Mathematics',
      'AI Programming',
      'Graphic Design',
      'Video Editing',
      'Environmental Science',
      'Chess',
      'Entrepreneurship',
      'Cultural Studies',
      'Game Development',
      'Mindfulness and Mental Health',
    ];

    // 多選邏輯
    const handleInterestChange = (option: string) => {
      let interests = formData.interests || [];
      if (interests.includes(option)) {
        interests = interests.filter(i => i !== option);
      } else {
        if (interests.length < 10) {
          interests = [...interests, option];
        }
      }
      setFormData({ ...formData, interests });
    };
    const handleOtherLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, otherLanguage: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFormSubmit({
            formData,
            requiredSkills: [],
            preferredSkills: [],
            weights: { skills: 0, experience: 0, education: 0 }
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-light">
                        <h5 className="mb-0"><i className="bi bi-journal-text me-2 text-primary"></i>告訴我們你想學習的語言、科目。</h5>
                    </div>
                    <div className="card-body p-4">
                        <div className="mb-4 animate__fadeInUp" style={{ animationDelay: '0.7s' }}>
                          <label className="form-label fw-bold">興趣／學術選擇（最多 10 項）</label>
                          <ul className="list-group mb-2">
                            {INTEREST_OPTIONS.map((option: string, idx: number) => {
                              const checked = !!formData.interests?.includes(option);
                              const disabled = !checked && (formData.interests?.length || 0) >= 10;
                              return (
                                <li
                                  key={option}
                                  className={`list-group-item d-flex align-items-center animate__fadeInUp ${checked ? 'active border-primary' : ''}`}
                                  style={{ cursor: disabled ? 'not-allowed' : 'pointer', animationDelay: `${0.8 + idx * 0.05}s`, userSelect: 'none' }}
                                  onClick={() => !disabled && handleInterestChange(option)}
                                >
                                  <span
                                    className={`me-3 d-inline-flex align-items-center justify-content-center border rounded ${checked ? 'bg-primary border-primary' : 'bg-white border-secondary'}`}
                                    style={{ width: 28, height: 28, fontSize: 20, transition: 'background 0.2s, border 0.2s' }}
                                    onClick={e => { e.stopPropagation(); if (!disabled) handleInterestChange(option); }}
                                  >
                                    {checked && <i className="bi bi-check-lg text-white"></i>}
                                  </span>
                                  <span style={{ fontSize: '1.08rem', color: disabled ? '#aaa' : undefined }}>{option}</span>
                                </li>
                              );
                            })}
                          </ul>
                          {/* 顯示其他語言輸入欄位 */}
                          {formData.interests?.includes('Other languages') && (
                            <div className="mt-2 animate__fadeInUp" style={{ animationDelay: '1.5s' }}>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="請輸入其他語言..."
                                value={formData.otherLanguage || ''}
                                onChange={handleOtherLanguageChange}
                              />
                            </div>
                          )}
                          <div className="form-text">可多選，最多 10 項</div>
                        </div>
                        <div className="mb-3 animate__fadeInUp" style={{ animationDelay: '1.6s' }}>
                          <label htmlFor="specialWish" className="form-label">特殊需求／願望（可選填）</label>
                          <textarea
                            className="form-control"
                            id="specialWish"
                            placeholder="請輸入您對補習班的特殊需求或願望..."
                            value={formData.specialWish || ''}
                            onChange={e => setFormData({ ...formData, specialWish: e.target.value })}
                            rows={3}
                          />
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-end mt-4 animate__fadeInUp" style={{ animationDelay: '1.7s' }}>
                    <button type="submit" className="btn btn-primary btn-lg px-5">
                        <i className="bi bi-arrow-right-circle-fill me-2"></i>
                        建立並預覽
                    </button>
                </div>
            </form>
        </div>
    );
};

// Step 1: Personal Info Form Component
const PersonalInfoStep = ({ formData, setFormData, setCurrentStep }: {
  formData: RequirementData['formData'],
  setFormData: (formData: RequirementData['formData']) => void,
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // 基本驗證
    if (!formData.jobTitle || !formData.nameEn || !formData.email || !formData.phone || !formData.school || !formData.department || !formData.grade || !formData.educationRequirements) {
      setError('請完整填寫所有欄位');
      return;
    }
    setError(null);
    setCurrentStep(2);
  };

  return (
    <form onSubmit={handleNext}>
      <h4 className="mb-4">個人資訊</h4>
      <div className="mb-3">
        <label htmlFor="jobTitle" className="form-label">姓名（中文）</label>
        <input type="text" className="form-control" id="jobTitle" placeholder="例如：陳大文" value={formData.jobTitle || ''} onChange={handleInputChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="nameEn" className="form-label">name (英文)</label>
        <input type="text" className="form-control" id="nameEn" placeholder="例如：David Chen" value={formData.nameEn || ''} onChange={handleInputChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">電郵地址</label>
        <input type="email" className="form-control" id="email" placeholder="例如：david@email.com" value={formData.email || ''} onChange={handleInputChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="phone" className="form-label">電話號碼</label>
        <input type="tel" className="form-control" id="phone" placeholder="例如：0912345678" value={formData.phone || ''} onChange={handleInputChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="school" className="form-label">學校</label>
        <input type="text" className="form-control" id="school" placeholder="例如：國立台灣大學" value={formData.school || ''} onChange={handleInputChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="department" className="form-label">學系</label>
        <input type="text" className="form-control" id="department" placeholder="例如：資訊工程學系" value={formData.department || ''} onChange={handleInputChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="grade" className="form-label">年級</label>
        <input type="text" className="form-control" id="grade" placeholder="例如：三年級" value={formData.grade || ''} onChange={handleInputChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="educationRequirements" className="form-label">學歷</label>
        <input type="text" className="form-control" id="educationRequirements" placeholder="例如：大學學位" value={formData.educationRequirements || ''} onChange={handleInputChange} />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="d-flex justify-content-end mt-4">
        <button type="submit" className="btn btn-primary btn-lg px-5">下一步 <i className="bi bi-arrow-right"></i></button>
      </div>
    </form>
  );
};


const DocumentComparisonPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = ['個人資料', '你想學什麼語言、科目？', '已存要求', '查看結果', '預約體驗時間'];
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isStudent, setIsStudent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submittedRequirements, setSubmittedRequirements] = useState<RequirementData | null>(null);
  const [matchedAlumni, setMatchedAlumni] = useState<AlumniType[]>([]);
  // 新增 AI 匹配理由 state
  const [aiMatchReasons, setAiMatchReasons] = useState<string[]>([]);
  // 移除 smartMatchInfo 狀態
  // const [smartMatchInfo, setSmartMatchInfo] = useState<SmartMatchInfo | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  // 新增：選擇學長狀態
  const [selectedTutors, setSelectedTutors] = useState<string[]>([]);
  // 多學長預約時間 state（移到頂層）
  const [tutorSchedules, setTutorSchedules] = useState<{ [id: string]: { date: string; time: string } }>({});
  const [showFullResumeMap, setShowFullResumeMap] = useState<{ [id: string]: boolean }>({});
  
  const [requirementsState, setRequirementsState] = useState<RequirementData>({
    formData: {
        jobTitle: '',
        nameEn: '',
        jobDescription: '',
        school: '',
        department: '',
        grade: '',
        experienceRequirements: '',
        educationRequirements: '',
        additionalNotes: '',
        email: '',
        phone: '',
    },
    requiredSkills: [],
    preferredSkills: [],
    weights: {
        skills: 50,
        experience: 30,
        education: 20
    }
  });

  // 共用型別：推薦學長型別
  type TopAlumniType = AlumniType & { _matchCount?: number; interests?: string[] };


  const handleRequirementSubmit = async (fullFormData: RequirementData) => {
    setAiSummaryLoading(true);
    setCurrentStep(3); // 立即跳到 Step 3，顯示 loading
    // 呼叫 AI summary
    const res = await fetch('/api/ai-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        interests: fullFormData.formData.interests,
        otherLanguage: fullFormData.formData.otherLanguage,
        specialWish: fullFormData.formData.specialWish,
      }),
    });
    const { summary } = await res.json();
    setRequirementsState({
      ...fullFormData,
      aiSummary: summary,
    });
    setSubmittedRequirements({
      ...fullFormData,
      aiSummary: summary,
    });
    setAiSummaryLoading(false);
  };

  const finalSubmit = async () => {
    setShowConfirmModal(false);
    if (!submittedRequirements) {
      alert("資料不完整，無法遞交。");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    // Get the user's token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        setSubmissionError("驗證失敗，請重新登入後再試。");
        setIsSubmitting(false);
        return;
    }

    const formData = new FormData();
    formData.append('requirements', JSON.stringify(submittedRequirements));
    // uploadedFiles.forEach(file => { // This line is removed
    //     formData.append('resumes', file);
    // });

    try {
        const response = await fetch('/api/submit-requirement', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
            },
            body: formData,
        });

        let result;
        try {
          result = await response.json();
        } catch {
          result = { error: 'API 回傳非 JSON，請檢查伺服器 log' };
        }

        if (!response.ok) {
            throw new Error(result.error || '遞交失敗，請稍後再試。');
        }

        // === 自動寫入 student table ===
        const { jobTitle, school, department, grade, educationRequirements, experienceRequirements } = submittedRequirements.formData;
        await fetch('/api/add-student', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            user_id: session.user.id,
            name: jobTitle,
            school,
            department,
            grade,
            education: educationRequirements,
            experience: experienceRequirements,
          }),
        });
        // === End ===

        // === Gemini AI 自動填入欄位 ===
        // 這段原本會強制跳回 Step 2，現已移除，讓流程能順利進到 Step 4
        // if (result.geminiExtracted && typeof result.geminiExtracted === 'object') {
        //   const g = result.geminiExtracted;
        //   setRequirementsState((prev: RequirementData) => ({
        //     ...prev,
        //     formData: {
        //       ...prev.formData,
        //       jobTitle: (g.name || prev.formData.jobTitle) || '',
        //       school: (g.school || prev.formData.school) || '',
        //       department: (g.department || prev.formData.department) || '',
        //       grade: (g.grade || prev.formData.grade) || '',
        //       educationRequirements: (g.education || prev.formData.educationRequirements) || '',
        //     }
        //   }));
        //   setCurrentStep(2); // 跳回 Step 2 讓用戶確認/編輯
        //   setResultLoading(false);
        //   setIsSubmitting(false);
        //   return;
        // }
        // === End Gemini AI 自動填入欄位 ===

        // 遞交成功後自動比對學長
        const matchFormData = new FormData();
        // if (uploadedFiles.length > 0) { // This line is removed
        //   matchFormData.append('resume', uploadedFiles[0]);
        // }
        matchFormData.append('school', submittedRequirements.formData.school);
        matchFormData.append('department', submittedRequirements.formData.department);
        matchFormData.append('grade', submittedRequirements.formData.grade);
        matchFormData.append('education', submittedRequirements.formData.educationRequirements);
        matchFormData.append('experience', submittedRequirements.formData.experienceRequirements);
        matchFormData.append('skills', submittedRequirements.requiredSkills.join(','));
        // 傳遞語意搜尋關鍵欄位
        if (submittedRequirements.formData.interests) {
          submittedRequirements.formData.interests.forEach(i => matchFormData.append('interests', i));
        }
        if (submittedRequirements.formData.otherLanguage) {
          matchFormData.append('otherLanguage', submittedRequirements.formData.otherLanguage);
        }
        if (submittedRequirements.formData.specialWish) {
          matchFormData.append('specialWish', submittedRequirements.formData.specialWish);
        }

        const matchRes = await fetch('/api/match-alumni', {
          method: 'POST',
          body: matchFormData,
        });
        const { alumni, smartMatch, aiMatchReasons } = await matchRes.json();
        setMatchedAlumni(alumni);
        setAiMatchReasons(aiMatchReasons || []);
        // 如果有智能匹配資訊，顯示給用戶
        if (smartMatch && (smartMatch.originalDepartment !== smartMatch.matchedDepartment || 
                          smartMatch.originalSchool !== smartMatch.matchedSchool)) {
        }
        // 將 AI 匹配理由儲存起來
        setMatchedAlumni(prev => prev.map(a => ({ ...a, aiMatchReasons: aiMatchReasons })));

    } catch (error: unknown) {
      if (error instanceof Error) {
        setSubmissionError(error.message);
      }
    } finally {
        setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Assuming you have a 'profiles' table with a 'role' column.
        // You'll need to set up Row Level Security on this table.
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          router.push('/login');
        } else if (profile && profile.role === 'student') {
          setIsStudent(true);
        } else {
          // Not a student, redirect
          router.push('/login');
        }
      } else {
        // No user, redirect
        router.push('/login');
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const renderStepContent = () => {
    console.log('renderStepContent requirementsState:', requirementsState);
    console.log('renderStepContent currentStep:', currentStep);
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep formData={requirementsState.formData} setFormData={formData => setRequirementsState(prev => ({ ...prev, formData }))} setCurrentStep={setCurrentStep} />;
      case 2:
        return <RequirementsStep formData={requirementsState.formData} setFormData={formData => setRequirementsState(prev => ({ ...prev, formData }))} onFormSubmit={handleRequirementSubmit} />;
      case 3:
        return <>
          <SavedRequirementsStep 
            requirements={submittedRequirements} 
            onEdit={() => setCurrentStep(2)} 
            onSubmit={() => setShowConfirmModal(true)}
            isSubmitting={isSubmitting}
            submissionError={submissionError}
            aiSummaryLoading={aiSummaryLoading}
          />
          {/* 確認遞交 Modal */}
          {showConfirmModal && (
            <div className="modal fade show d-block" tabIndex={-1} style={{background: 'rgba(0,0,0,0.3)'}}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">確認遞交</h5>
                    <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <p>您確定要遞交這份要求並進行 AI 智能分析嗎？</p>
                    {isSubmitting && (
                      <div className="alert alert-info text-center mt-3">
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        AI 正在分析中，請稍候...
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)} disabled={isSubmitting}>取消</button>
                    <button className="btn btn-primary" onClick={() => {
                      setCurrentStep(4);
                      finalSubmit();
                    }} disabled={isSubmitting}>確認遞交</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>;
      case 4:
        // 直接依照後端順序顯示前三位，並明確型別
        const userSpecialWish = submittedRequirements?.formData.specialWish || '';
        const topAlumni: TopAlumniType[] = matchedAlumni.slice(0, 3);
        return (
          <div>
            {/* 最相似的學長卡片 */}
            <div className="mb-4">
              <div className="alumni-card flex-fill position-relative" style={{
                borderRadius: 18,
                border: '1.5px solid #0d6efd',
                background: '#f6f8fa',
                boxShadow: '0 2px 12px 0 #e0e0e0a0',
                padding: '0 0 0 0',
                margin: '0 auto 24px auto',
                minHeight: 120,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
                transition: 'box-shadow 0.2s, border 0.2s',
                overflow: 'hidden',
              }}>
                {/* 左：AI 智能匹配結果標題與用戶願望 */}
                <div style={{ minWidth: 120, background: '#0d6efd', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 12px 24px 12px' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.18rem', marginBottom: 6 }}><i className="bi bi-lightbulb-fill me-2"></i>AI 智能匹配</div>
                  <div style={{ fontSize: '0.98rem', opacity: 0.95 }}>您的特殊需求／願望：</div>
                  <div style={{ fontWeight: 500, fontSize: '1.05rem', color: '#ffe066', marginTop: 2 }}>{userSpecialWish ? userSpecialWish : '（未填寫）'}</div>
                </div>
                {/* 右：AI 匹配理由與興趣交集 */}
                <div style={{ flex: 1, padding: '18px 18px 18px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  {aiMatchReasons && aiMatchReasons.length > 0 && (
                    <div className="alert alert-info mb-2 p-2" style={{ fontSize: '1.01rem', background: '#e6f9ed', color: '#1a7f37', border: '1.1px solid #28a745', borderRadius: 10 }}>
                      <strong>AI 匹配理由：</strong>
                      <ul className="mb-0 ps-3">
                        {aiMatchReasons.map((reason: string, idx: number) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-2" style={{ fontSize: '0.98rem', color: '#555' }}>
                    <span><i className="bi bi-people-fill me-1 text-primary"></i>最相似的學長</span>
                    <span className="badge bg-primary" style={{ fontSize: '0.97rem', padding: '0.4em 0.9em' }}>{topAlumni[0]?.name || '無'}</span>
                    <span className="badge bg-success" style={{ fontSize: '0.97rem', padding: '0.4em 0.9em' }}>{topAlumni[0]?.school} {topAlumni[0]?.department}</span>
                    {typeof topAlumni[0]?._matchCount === 'number' && (
                      <span className="badge bg-info ms-2">興趣相同數：{topAlumni[0]?._matchCount}</span>
                    )}
                  </div>
                  {/* 興趣交集表格 */}
                  {submittedRequirements?.formData.interests && Array.isArray(topAlumni[0]?.interests) && (
                    <div className="table-responsive">
                      <table className="table table-bordered align-middle mb-0" style={{ minWidth: 320, background: '#fff' }}>
                        <thead>
                          <tr>
                            <th className="text-center" style={{ width: '45%' }}>用戶興趣</th>
                            <th className="text-center" style={{ width: '10%' }}>吻合</th>
                            <th className="text-center" style={{ width: '45%' }}>學長興趣</th>
                          </tr>
                        </thead>
                        <tbody>
                          {submittedRequirements.formData.interests.map((userInterest, idx) => {
                            const alumniInterests = Array.isArray(topAlumni[0].interests) ? topAlumni[0].interests : [];
                            const matched = alumniInterests.includes(userInterest);
                            return (
                              <tr key={idx}>
                                <td className="text-end pe-3" style={{ color: matched ? '#28a745' : '#dc3545', fontWeight: matched ? 'bold' : 'normal', fontSize: '1.08rem' }}>{userInterest}</td>
                                <td className="text-center">
                                  {matched ? (
                                    <span style={{ color: '#28a745', fontSize: '1.6rem' }}><i className="bi bi-check-circle-fill"></i></span>
                                  ) : (
                                    <span style={{ color: '#dc3545', fontSize: '1.6rem' }}><i className="bi bi-x-circle-fill"></i></span>
                                  )}
                                </td>
                                <td className="text-start ps-3" style={{ color: matched ? '#28a745' : '#dc3545', fontWeight: matched ? 'bold' : 'normal', fontSize: '1.08rem' }}>
                                  {matched ? userInterest : ''}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* 推薦學長卡片區塊：三欄固定分佈 */}
            <h5 className="mb-4" style={{marginBottom: '2.2rem'}}><i className="bi bi-people-fill me-2 text-primary"></i>推薦學長（由多至少顯示，僅列出前三位）</h5>
            <div className="d-flex flex-column align-items-center gap-4 mb-2">
              {topAlumni.map((a: TopAlumniType) => {
                const isSelected = selectedTutors.includes(a.id);
                const userInterests = submittedRequirements?.formData.interests || [];
                const alumniInterests = Array.isArray(a.interests) ? a.interests : [];
                const showFullResume = showFullResumeMap[a.id] || false;
                const setShowFullResume = (open: boolean) => setShowFullResumeMap(prev => ({ ...prev, [a.id]: open }));
                const matchedInterests = userInterests.filter(i => alumniInterests.includes(i));
                const unmatchedInterests = userInterests.filter(i => !alumniInterests.includes(i));
                // 取首字母
                const avatar = a.name ? a.name[0] : '?';
                return (
                  <div key={a.id} className="col-12 col-md-8 col-lg-6 d-flex justify-content-center">
                    <div
                      className={`card shadow-sm w-100 mb-3 animate__animated animate__fadeInUp ${isSelected ? 'border-primary' : ''}`}
                      style={{
                        borderRadius: 16,
                        border: isSelected ? '2.5px solid #0d6efd' : '1.2px solid #e0e0e0',
                        background: '#fff',
                        boxShadow: '0 2px 12px 0 #e0e0e0a0',
                        padding: '0 0 0 0',
                        minHeight: 0,
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'box-shadow 0.2s, border 0.2s',
                        marginBottom: 18,
                        maxWidth: 1000,
                        width: '100%',
                      }}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedTutors(selectedTutors.filter(id => id !== a.id));
                        } else if (selectedTutors.length < 3) {
                          setSelectedTutors([...selectedTutors, a.id]);
                        }
                      }}
                    >
                      {/* 左側：頭像與基本資料 */}
                      <div style={{ minWidth: 90, background: '#f6f8fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '18px 8px 18px 12px' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#0d6efd22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: '#0d6efd', marginBottom: 8 }}>{avatar}</div>
                        <div className="fw-bold text-center" style={{ fontSize: '1.08rem', lineHeight: 1.2 }}>{a.name}</div>
                        <div className="text-muted text-center" style={{ fontSize: '0.97rem', lineHeight: 1.1 }}>{a.school}<br />{a.department}</div>
                      </div>
                      {/* 中間：年級/學歷/經驗/技能 */}
                      <div style={{ flex: 1, padding: '18px 12px 18px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div className="d-flex flex-wrap gap-2 mb-2" style={{ fontSize: '0.98rem', color: '#555' }}>
                          <span><i className="bi bi-calendar-event me-1 text-muted"></i>{a.grade}</span>
                          <span><i className="bi bi-mortarboard me-1 text-muted"></i>{a.education}</span>
                          <span><i className="bi bi-briefcase me-1 text-muted"></i>{a.experience}</span>
                        </div>
                        <div className="mb-1" style={{ fontSize: '0.97rem', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>
                          <i className="bi bi-star me-1 text-muted"></i>{a.skills?.join('、') || '未提供'}
                        </div>
                        {/* 摘要展開按鈕 */}
                        {a.resume_content && (
                          <div className="mt-2">
                            <button className="btn btn-link btn-sm p-0" style={{ color: '#0d6efd', textDecoration: 'underline', fontSize: '0.97rem' }} onClick={e => { e.stopPropagation(); setShowFullResume(!showFullResume); }}>
                              {showFullResume ? '收起履歷摘要' : '展開履歷摘要'}
                            </button>
                            {showFullResume && (
                              <pre className="text-muted small mb-0 mt-1" style={{ fontSize: '1.01rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: 'none', border: 'none', padding: 0, maxHeight: 180, overflow: 'auto' }}>
                                {a.resume_content.split('、').map((line, idx, arr) => idx < arr.length - 1 ? line + '、\n' : line).join('')}
                              </pre>
                            )}
                          </div>
                        )}
                      </div>
                      {/* 右側：興趣比對 tag 區塊 */}
                      <div style={{ minWidth: 120, background: '#f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '18px 10px 18px 10px', borderLeft: '1.5px solid #e0e0e0' }}>
                        <div className="mb-1" style={{ fontWeight: 500, color: '#333', fontSize: '1.01rem' }}><i className="bi bi-check2-all me-2 text-success"></i>興趣比對</div>
                        <div className="d-flex flex-wrap gap-1">
                          {matchedInterests.map((interest, idx) => (
                            <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', background: '#e6f9ed', color: '#28a745', borderRadius: 14, padding: '2px 9px 2px 7px', fontWeight: 'bold', fontSize: '0.97rem', border: '1.1px solid #28a745', marginRight: 4, marginBottom: 2 }}>
                              <i className="bi bi-check-circle-fill me-1" style={{ fontSize: 14 }}></i>{interest}
                            </span>
                          ))}
                          {unmatchedInterests.map((interest, idx) => (
                            <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', background: '#fbeaea', color: '#dc3545', borderRadius: 14, padding: '2px 9px 2px 7px', fontWeight: 'normal', fontSize: '0.97rem', border: '1.1px solid #dc3545', marginRight: 4, marginBottom: 2 }}>
                              <i className="bi bi-x-circle-fill me-1" style={{ fontSize: 14 }}></i>{interest}
                            </span>
                          ))}
                        </div>
                      </div>
                      {/* 右上角勾選框 */}
                      <div style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, border: '2px solid #0d6efd', borderRadius: 6, background: isSelected ? '#0d6efd' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, transition: 'background 0.2s', cursor: 'pointer' }}
                        onClick={e => { e.stopPropagation(); if (isSelected) { setSelectedTutors(selectedTutors.filter(id => id !== a.id)); } else if (selectedTutors.length < 3) { setSelectedTutors([...selectedTutors, a.id]); } }}>
                        {isSelected && <i className="bi bi-check-lg text-white fs-4"></i>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* 右下角下一步按鈕 */}
            {selectedTutors.length > 0 && (
              <div className="d-flex justify-content-end mt-4">
                <button className="btn btn-primary btn-lg shadow" onClick={() => setCurrentStep(5)}>
                  下一步：選擇體驗時間 <i className="bi bi-arrow-right-circle ms-2"></i>
                </button>
              </div>
            )}
          </div>
        );
      case 5:
        // Step 5：選擇日期與時間
        const topAlumniStep5: TopAlumniType[] = matchedAlumni.slice(0, 3);
        // 只顯示已選擇的學長
        const selectedAlumni = topAlumniStep5.filter(a => selectedTutors.includes(a.id));
        // 所有已選學長都選了日期和時間才可預約
        const canBook = selectedAlumni.length > 0 && selectedAlumni.every(a => tutorSchedules[a.id]?.date && tutorSchedules[a.id]?.time);
        const handleBooking = () => {
          // 這裡可串接 API，暫時直接進入成功頁
          setCurrentStep(6);
        };
        return (
          <div className="mt-5">
            <h4 className="mb-4 text-center">預約 20 分鐘體驗課</h4>
            <div className="mb-3">
              <strong>已選擇學長：</strong>
              <ul>
                {selectedAlumni.map(a => (
                  <li key={a.id}>{a.name}（{a.school} {a.department}）</li>
                ))}
              </ul>
            </div>
            {selectedAlumni.map(a => (
              <div key={a.id} className="mb-4 border rounded p-3 bg-light">
                <div className="mb-2 fw-bold">{a.name}（{a.school} {a.department}）</div>
                <div className="row g-2 align-items-center">
                  <div className="col-auto">
                    <label className="form-label mb-0">日期</label>
                  </div>
                  <div className="col-auto">
                    <input type="date" className="form-control" value={tutorSchedules[a.id]?.date || ''} onChange={e => setTutorSchedules(prev => ({ ...prev, [a.id]: { ...prev[a.id], date: e.target.value } }))} />
                  </div>
                  <div className="col-auto">
                    <label className="form-label mb-0">時間</label>
                  </div>
                  <div className="col-auto">
                    <input type="time" className="form-control" value={tutorSchedules[a.id]?.time || ''} onChange={e => setTutorSchedules(prev => ({ ...prev, [a.id]: { ...prev[a.id], time: e.target.value } }))} />
                  </div>
                </div>
              </div>
            ))}
            <button className="btn btn-success btn-lg" disabled={!canBook} onClick={handleBooking}>
              確認預約
            </button>
          </div>
        );
      case 6:
        return (
          <div className="d-flex flex-column align-items-center justify-content-center py-5">
            <div className="alert alert-success text-center" style={{ maxWidth: 600 }}>
              <h3 className="mb-4">🎉 恭喜你，已經成功預約！</h3>
              <p>我們會與導師溝通，如有特別的時間更改安排我們會電郵通知你。<br />
              如導師確認，我們會發送電郵進行 20 分鐘體驗課，敬請留意電郵。</p>
            </div>
          </div>
        );
      default:
        return <div>Step not found</div>;
    }
  };

  if (loading) {
    return (
        <Layout title="載入中...">
            <div className="container py-5 text-center">
                <h2>載入中...</h2>
                <p>正在驗證您的存取權限。</p>
            </div>
        </Layout>
    );
  }

  if (!isStudent) {
    // This part might be briefly visible before the redirect kicks in,
    // or if the redirect fails for some reason.
    return (
      <Layout title="禁止存取">
        <div className="container py-5 text-center">
          <h2>禁止存取</h2>
          <p>您必須以學生身份登入才能瀏覽此頁面。</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="AI 履歷評估系統">
      <Head>
        <title>AI 履歷評估系統</title>
        {<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />}
      </Head>

      {/* 頂部 Logo/系統名稱 */}
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="fw-bold fs-4 text-primary">AI 履歷評估系統</div>
          {/* <UserMenu /> 可加用戶資訊/登出 */}
        </div>
        {/* Stepper 置中、寬版 */}
        <div className="stepper mb-5">{steps.map((title, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          return (
            <React.Fragment key={index}>
              <div className={`step ${isActive ? 'active' : isCompleted ? 'completed' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentStep(stepNumber)}>
                <div className="circle">
                  {isCompleted ? <i className="bi bi-check-lg fs-4"></i> : <span className="fs-5 fw-bold">{stepNumber}</span>}
                </div>
                <p className={`fw-bold mt-2 mb-0 label`}>{title}</p>
              </div>
              {index < steps.length - 1 && <div className="flex-grow-1 mx-3" style={{ height: '2px', backgroundColor: isCompleted ? 'var(--primary)' : '#e0e0e0', transition: 'background-color 0.3s' }}></div>}
            </React.Fragment>
          );
        })}</div>
        {/* 主要內容卡片置中，最大寬度900px */}
        <div className="d-flex justify-content-center">
          <div style={{ maxWidth: 1400, width: '100%' }}>
            <div className="card shadow-sm p-4">
              {/* 根據 currentStep 顯示不同內容 */}
              {renderStepContent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DocumentComparisonPage;