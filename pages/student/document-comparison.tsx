import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
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
    };
    requiredSkills: string[];
    preferredSkills: string[];
    weights: {
      skills: number;
      experience: number;
      education: number;
    };
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

type SmartMatchInfo = {
  originalDepartment: string;
  originalSchool: string;
  matchedDepartment: string;
  matchedSchool: string;
  departmentScore?: number;
  schoolScore?: number;
  reasoning?: string;
  matchedDepartments?: string[];
  departmentScores?: Record<string, number>;
};

// Step 1: Upload Resumes Component
const allowedTypes = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const maxFileSize = 5 * 1024 * 1024; // 5MB

const UploadStep = ({ files, onFilesChange, setRequirementsState, setCurrentStep }: {
  files: File[],
  onFilesChange: (files: File[]) => void,
  setRequirementsState: Dispatch<SetStateAction<RequirementData>>,
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newFiles: File[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (!allowedTypes.includes(file.type)) {
        setError('只允許 PDF, TXT, DOC, 和 DOCX 檔案。');
        continue;
      }
      if (file.size > maxFileSize) {
        setError('每個檔案必須小於 5MB。');
        continue;
      }
      // Prevent duplicate file names by checking against the files from props
      if (files.some(f => f.name === file.name)) continue;
      newFiles.push(file);
    }
    if (newFiles.length > 0) {
      onFilesChange([...files, ...newFiles]);
      setError(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = (name: string) => {
    onFilesChange(files.filter(f => f.name !== name));
  };

  const handleNext = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('resumes', file));
      const res = await fetch('/api/extract-cv-info', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('AI 分析失敗，請稍後再試');
      const { geminiExtracted } = await res.json();
      console.log('Gemini Extracted:', geminiExtracted);
      let parsed = geminiExtracted;
      if ('raw' in geminiExtracted && typeof geminiExtracted.raw === 'string') {
        const match = geminiExtracted.raw.match(/```json\n([\s\S]*)```/);
        if (match && match[1]) {
          try {
            parsed = JSON.parse(match[1]);
          } catch {
            parsed = {};
          }
        }
      }
      setRequirementsState((prev: RequirementData) => {
        const updated = {
          ...prev,
          formData: {
            ...prev.formData,
            jobTitle: (parsed.name ?? prev.formData.jobTitle) || '',
            email: (parsed.email ?? prev.formData.email) || '',
            school: (parsed.school ?? prev.formData.school) || '',
            department: (parsed.department ?? prev.formData.department) || '',
            grade: (parsed.grade ?? prev.formData.grade) || '',
            educationRequirements: (parsed.education ?? prev.formData.educationRequirements) || '',
          }
        };
        console.log('setRequirementsState 更新:', updated);
        return updated;
      });
      setCurrentStep(2);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message || 'AI 分析失敗');
      } else {
        setError('AI 分析失敗');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="mb-4">上傳履歷</h4>
      <div
        className="d-flex flex-column align-items-center justify-content-center p-5 text-center"
        style={{
          border: '2px dashed var(--bs-primary)',
          borderRadius: '15px',
          background: 'rgba(var(--bs-primary-rgb), 0.05)',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('resume-upload-input')?.click()}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(var(--bs-primary-rgb), 0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(var(--bs-primary-rgb), 0.05)'}
      >
        <i className="bi bi-cloud-arrow-up-fill fs-1 text-primary mb-3"></i>
        <h5 className="mt-3">拖曳或點擊此處上傳履歷</h5>
        <p className="text-muted small">支援 PDF, TXT, DOC, DOCX 檔案 (每個檔案上限 5MB)</p>
        <input
          id="resume-upload-input"
          type="file"
          accept=".pdf,.txt,.doc,.docx"
          multiple
          style={{ display: 'none' }}
          onChange={handleInputChange}
        />
      </div>
      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          <i className="bi bi-x-circle me-2"></i>
          {error}
        </div>
      )}
      {files.length > 0 ? (
        <div className="mt-4">
          <h6 className="mb-3">已上傳檔案:</h6>
          <div className="list-group">
            {files.map(file => (
              <div key={file.name} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <i className="bi bi-file-earmark-text me-2"></i>
                  <span className="fw-bold">{file.name}</span>
                  <span className="text-muted ms-2 small">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <button className="btn btn-sm btn-outline-danger" onClick={() => removeFile(file.name)}>
                  <i className="bi bi-trash3-fill"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="alert alert-secondary text-center mt-4" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          尚未上傳履歷。請至少上傳一份履歷以進行評估。
        </div>
      )}
      <div className="d-flex justify-content-end mt-4">
        <button 
          className="btn btn-primary btn-lg px-5" 
          onClick={handleNext} 
          disabled={files.length === 0 || loading}
        >
          {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span>AI 分析中...</>) : (<>下一步 <i className="bi bi-arrow-right"></i></>)}
        </button>
      </div>
    </div>
  );
};

// Step 3: Saved Requirements Component
const SavedRequirementsStep = ({ requirements, onEdit, onSubmit, isSubmitting, submissionError }: { 
    requirements: RequirementData | null, 
    onEdit: () => void, 
    onSubmit: () => void,
    isSubmitting: boolean,
    submissionError: string | null
}) => {
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
      'Other languages',
      'Female',
      'Male',
      'Chinese Tutor',
      'HK Local Tutor',
      'Foreign Tutor',
      'Art',
      'Science',
      'Sport',
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
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
                        <h5 className="mb-0"><i className="bi bi-journal-text me-2 text-primary"></i>AI自動填欄（可手動修改）</h5>
                    </div>
                    <div className="card-body p-4">
                        <div className="mb-3">
                            <label htmlFor="jobTitle" className="form-label">姓名（中英文）</label>
                            <input type="text" className="form-control" id="jobTitle" placeholder="例如：陳大文 / David Chen" value={formData.jobTitle || ''} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">電郵地址</label>
                            <input type="email" className="form-control" id="email" placeholder="例如：david@email.com" value={formData.email || ''} onChange={handleInputChange} />
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
                        <div className="mb-4">
                          <label className="form-label fw-bold">興趣／學術選擇（最多 10 項）</label>
                          <div className="d-flex flex-wrap gap-2">
                            {INTEREST_OPTIONS.map((option: string) => (
                              <label key={option} className={`btn btn-outline-primary mb-2 ${formData.interests?.includes(option) ? 'active' : ''}`}
                                style={{ minWidth: 120 }}>
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  autoComplete="off"
                                  checked={!!formData.interests?.includes(option)}
                                  onChange={() => handleInterestChange(option)}
                                  disabled={
                                    !formData.interests?.includes(option) && (formData.interests?.length || 0) >= 10
                                  }
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                          {/* 顯示其他語言輸入欄位 */}
                          {formData.interests?.includes('Other languages') && (
                            <div className="mt-2">
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
                    </div>
                </div>
                <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn btn-primary btn-lg px-5">
                        <i className="bi bi-arrow-right-circle-fill me-2"></i>
                        建立並預覽
                    </button>
                </div>
            </form>
        </div>
    );
};


const DocumentComparisonPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = ['上傳履歷', '期望工作要求', '已存要求', '查看結果'];
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isStudent, setIsStudent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [submittedRequirements, setSubmittedRequirements] = useState<RequirementData | null>(null);
  const [matchedAlumni, setMatchedAlumni] = useState<AlumniType[]>([]);
  const [smartMatchInfo, setSmartMatchInfo] = useState<SmartMatchInfo | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [resultLoading, setResultLoading] = useState(false);
  
  const [requirementsState, setRequirementsState] = useState<RequirementData>({
    formData: {
        jobTitle: '',
        jobDescription: '',
        school: '',
        department: '',
        grade: '',
        experienceRequirements: '',
        educationRequirements: '',
        additionalNotes: '',
    },
    requiredSkills: [],
    preferredSkills: [],
    weights: {
        skills: 50,
        experience: 30,
        education: 20
    }
  });


  const handleRequirementSubmit = (fullFormData: RequirementData) => {
    setRequirementsState(fullFormData); // Save the latest data
    setSubmittedRequirements(fullFormData);
    setCurrentStep(3);
  };

  const finalSubmit = async () => {
    setShowConfirmModal(false);
    setResultLoading(true);
    if (!submittedRequirements || uploadedFiles.length === 0) {
        alert("資料不完整，無法遞交。");
        setResultLoading(false);
        return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    // Get the user's token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        setSubmissionError("驗證失敗，請重新登入後再試。");
        setIsSubmitting(false);
        setResultLoading(false);
        return;
    }

    const formData = new FormData();
    formData.append('requirements', JSON.stringify(submittedRequirements));
    uploadedFiles.forEach(file => {
        formData.append('resumes', file);
    });

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

        // === Gemini AI 自動填入欄位 ===
        if (result.geminiExtracted && typeof result.geminiExtracted === 'object') {
          const g = result.geminiExtracted;
          setRequirementsState((prev: RequirementData) => ({
            ...prev,
            formData: {
              ...prev.formData,
              jobTitle: (g.name || prev.formData.jobTitle) || '',
              school: (g.school || prev.formData.school) || '',
              department: (g.department || prev.formData.department) || '',
              grade: (g.grade || prev.formData.grade) || '',
              educationRequirements: (g.education || prev.formData.educationRequirements) || '',
            }
          }));
          setCurrentStep(2); // 跳回 Step 2 讓用戶確認/編輯
          setResultLoading(false);
          setIsSubmitting(false);
          return;
        }
        // === End Gemini AI 自動填入欄位 ===

        // 遞交成功後自動比對學長
        const matchFormData = new FormData();
        matchFormData.append('resume', uploadedFiles[0]);
        matchFormData.append('school', submittedRequirements.formData.school);
        matchFormData.append('department', submittedRequirements.formData.department);
        matchFormData.append('grade', submittedRequirements.formData.grade);
        matchFormData.append('education', submittedRequirements.formData.educationRequirements);
        matchFormData.append('experience', submittedRequirements.formData.experienceRequirements);
        matchFormData.append('skills', submittedRequirements.requiredSkills.join(','));

        const matchRes = await fetch('/api/match-alumni', {
          method: 'POST',
          body: matchFormData,
        });
        const { alumni, smartMatch } = await matchRes.json();
        setMatchedAlumni(alumni);
        setSmartMatchInfo(smartMatch);
        
        // 如果有智能匹配資訊，顯示給用戶
        if (smartMatch && (smartMatch.originalDepartment !== smartMatch.matchedDepartment || 
                          smartMatch.originalSchool !== smartMatch.matchedSchool)) {
        }

        setResultLoading(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSubmissionError(error.message);
      }
      setResultLoading(false);
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
        return <UploadStep files={uploadedFiles} onFilesChange={setUploadedFiles} setRequirementsState={setRequirementsState} setCurrentStep={setCurrentStep} />;
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
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>取消</button>
                    <button className="btn btn-primary" onClick={() => {
                      setCurrentStep(4);
                      setResultLoading(true);
                      finalSubmit();
                    }}>確認遞交</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>;
      case 4:
        return (
          <div>
            <h4 className="mb-4 text-center">最相似的學長</h4>
            {resultLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <div className="fw-bold">AI 正在分析中，請等候...</div>
              </div>
            ) : matchedAlumni && matchedAlumni.length > 0 ? (
              <>
                {/* 智能匹配資訊卡片 */}
                <div className="card mb-4 border-primary">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0"><i className="bi bi-lightbulb-fill me-2"></i>AI 智能匹配結果</h5>
                  </div>
                  <div className="card-body">
                    <table className="table table-bordered mb-3">
                      <thead>
                        <tr>
                          <th></th>
                          <th>學校</th>
                          <th>學系</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>原始條件</td>
                          <td>{smartMatchInfo?.originalSchool}</td>
                          <td>{smartMatchInfo?.originalDepartment}</td>
                        </tr>
                        <tr>
                          <td>智能匹配</td>
                          <td>{smartMatchInfo?.matchedSchool}</td>
                          <td>
                            {Array.isArray(smartMatchInfo?.matchedDepartments)
                              ? smartMatchInfo.matchedDepartments.map(
                                  d => `${d}${smartMatchInfo.departmentScores?.[d] ? `（${smartMatchInfo.departmentScores[d]}分）` : ''}`
                                ).join('、')
                              : (smartMatchInfo?.matchedDepartment || '未找到')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div>
                      <strong>AI 匹配理由：</strong>
                      <span className="text-muted">{smartMatchInfo?.reasoning}</span>
                      <ul className="mt-2">
                        <li>學校相似度：{smartMatchInfo?.schoolScore ?? '-'} 分</li>
                        <li>學系相似度：{smartMatchInfo?.departmentScore ?? '-'} 分</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 推薦學長卡片區塊：三欄分佈+動畫 */}
                <h5 className="mb-3"><i className="bi bi-people-fill me-2 text-primary"></i>推薦學長</h5>
                <div className="d-flex justify-content-center align-items-stretch gap-4 flex-wrap">
                  {matchedAlumni.slice(0, 3).map((a, index) => (
                    <div key={a.id} className="card mb-3 shadow-sm animate__animated animate__fadeInUp" style={{ minWidth: 350, maxWidth: 500, minHeight: 600, flex: 1, fontSize: '1.12rem' }}>
                      <div className="card-body d-flex flex-column h-100 p-5">
                        <div className="d-flex flex-column align-items-start mb-4">
                          <span className="badge bg-primary mb-2">#{index + 1}</span>
                          <div className="mb-2" style={{ width: '100%' }}>
                            <span className="badge bg-success" style={{ fontSize: '1rem', padding: '0.6em 1em' }}>
                              {a.school} {a.department}
                              {Array.isArray(smartMatchInfo?.matchedDepartments) && smartMatchInfo.matchedDepartments.includes(a.department) && (
                                <span className="ms-2 badge bg-info text-dark">AI相似學系</span>
                              )}
                            </span>
                          </div>
                          <span className="fw-bold" style={{ fontSize: '1.35rem', wordBreak: 'break-all', maxWidth: 220, display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {a.name}
                          </span>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <p style={{ fontSize: '1.08rem' }}><i className="bi bi-calendar-event me-2 text-muted"></i><strong>年級：</strong>{a.grade}</p>
                            <p style={{ fontSize: '1.08rem' }}><i className="bi bi-mortarboard me-2 text-muted"></i><strong>學歷：</strong>{a.education}</p>
                          </div>
                          <div className="col-md-6">
                            <p style={{ fontSize: '1.08rem' }}><i className="bi bi-briefcase me-2 text-muted"></i><strong>經驗：</strong>{a.experience}</p>
                            <p style={{ fontSize: '1.08rem' }}><i className="bi bi-star me-2 text-muted"></i><strong>技能：</strong>{a.skills?.join('、') || '未提供'}</p>
                          </div>
                        </div>
                        {a.resume_content && (
                          <div className="mt-4">
                            <h6 style={{ fontSize: '1.08rem' }}><i className="bi bi-file-text me-2 text-muted"></i>履歷摘要</h6>
                            <p className="text-muted small" style={{ fontSize: '1.05rem' }}>{a.resume_content.slice(0, 200)}...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                查無相似學長，建議您調整期望條件或聯繫管理員添加更多學長資料。
              </div>
            )}
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
         {/* You might need to add Bootstrap CSS if not globally available */}
         {/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" /> */}
         {/* <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" /> */}
      </Head>

      <div className="container-fluid bg-light py-5">
        <div className="container text-center">
            <h1 className="display-5">AI 履歷評估系統</h1>
            <p className="lead">
                根據不同的工作要求對多份履歷進行比較，客製化評估標準，並生成詳細的 AI 分析報告。
            </p>
        </div>
      </div>

      <div className="container py-5">
        {/* Stepper/Wizard Navigation */}
        <div className="row justify-content-center g-0 mb-5">
          <div className="col-10">
            <div className="d-flex justify-content-between align-items-center">
              {steps.map((title, index) => {
                const stepNumber = index + 1;
                const isActive = currentStep === stepNumber;
                const isCompleted = currentStep > stepNumber;
                return (
                  <React.Fragment key={index}>
                    <div className="d-flex flex-column align-items-center text-center" style={{ cursor: 'pointer' }} onClick={() => setCurrentStep(stepNumber)}>
                      <div 
                        className={`rounded-circle d-flex justify-content-center align-items-center ${isCompleted ? 'bg-primary text-white' : isActive ? 'bg-white border border-primary text-primary' : 'bg-light'}`}
                        style={{ width: '50px', height: '50px', transition: 'all 0.3s ease' }}
                      >
                        {isCompleted ? <i className="bi bi-check-lg fs-4"></i> : <span className="fs-5 fw-bold">{stepNumber}</span>}
                      </div>
                      <p className={`fw-bold mt-2 mb-0 ${isActive || isCompleted ? 'text-primary' : 'text-muted'}`}>{title}</p>
                    </div>
                    {index < steps.length - 1 && <div className="flex-grow-1 mx-3" style={{ height: '2px', backgroundColor: isCompleted ? 'var(--bs-primary)' : '#e0e0e0', transition: 'background-color 0.3s ease' }}></div>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Step Content */}
        <div className="p-4 bg-white rounded shadow-sm">
            {renderStepContent()}
        </div>
      </div>
    </Layout>
  );
};

export default DocumentComparisonPage;