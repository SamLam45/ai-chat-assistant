import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout'; // Assuming a Layout component exists
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';

interface RequirementData {
    formData: {
      jobTitle: string;
      jobDescription: string;
      school: string;
      department: string;
      grade: string;
      experienceRequirements: string;
      educationRequirements: string;
      additionalNotes: string;
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

// Step 1: Upload Resumes Component
const allowedTypes = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const maxFileSize = 5 * 1024 * 1024; // 5MB

const UploadStep = ({ files, onFilesChange, onNext }: { files: File[], onFilesChange: (files: File[]) => void, onNext: () => void }) => {
  const [error, setError] = useState<string | null>(null);

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
          onClick={onNext} 
          disabled={files.length === 0}
        >
          下一步 <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

// Step 3: Saved Requirements Component
const SavedRequirementsStep = ({ requirements, files, onEdit, onSubmit, isSubmitting, submissionError }: { 
    requirements: RequirementData | null, 
    files: File[], 
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

    const { formData, requiredSkills, preferredSkills, weights } = requirements;

    return (
        <div>
            <h4 className="mb-4 text-center">✅ 確認您的期望要求</h4>
            <p className="text-center text-muted mb-4">請仔細核對以下資料，確認無誤後即可遞交。</p>
            <div className="row g-4">
                {/* Left Column */}
                <div className="col-lg-7">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body p-4">
                            <h5 className="card-title mb-1">{formData.jobTitle}</h5>
                            <p className="text-muted">{formData.jobDescription || '未提供職位描述'}</p>
                            <hr />
                            
                            <h6 className="mb-3"><i className="bi bi-file-earmark-text-fill text-primary me-2"></i>已上傳履歷</h6>
                            {files.length > 0 ? (
                                <ul className="list-group list-group-flush mb-3">
                                    {files.map(file => (
                                        <li key={file.name} className="list-group-item">{file.name}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted">尚未上傳履歷</p>
                            )}
                            
                            <h6 className="mb-3"><i className="bi bi-mortarboard-fill text-primary me-2"></i>學術背景</h6>
                            <div className="row">
                                <div className="col-sm-6 mb-3">
                                    <label className="form-label text-muted small">期望學校</label>
                                    <p className="fw-bold">{formData.school}</p>
                                </div>
                                <div className="col-sm-6 mb-3">
                                    <label className="form-label text-muted small">期望學系</label>
                                    <p className="fw-bold">{formData.department || '未提供'}</p>
                                </div>
                                <div className="col-sm-6 mb-3">
                                    <label className="form-label text-muted small">年級</label>
                                    <p className="fw-bold">{formData.grade || '未提供'}</p>
                                </div>
                                <div className="col-sm-6 mb-3">
                                    <label className="form-label text-muted small">現時學歷</label>
                                    <p className="fw-bold">{formData.educationRequirements}</p>
                                </div>
                            </div>

                             <h6 className="mb-3 mt-2"><i className="bi bi-person-workspace text-primary me-2"></i>經驗與備註</h6>
                             <label className="form-label text-muted small">經驗</label>
                             <p className="fw-bold">{formData.experienceRequirements || '未提供'}</p>
                             <label className="form-label text-muted small">其他備註</label>
                             <p className="fw-bold">{formData.additionalNotes || '未提供'}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-lg-5">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body p-4">
                            <h6 className="mb-3"><i className="bi bi-star-fill text-primary me-2"></i>技能要求</h6>
                            <label className="form-label text-muted small">必要技能</label>
                            <div className="mb-3">
                                {requiredSkills.map((skill: string) => <span key={skill} className="badge bg-primary me-1 mb-1 p-2">{skill}</span>)}
                            </div>

                            <label className="form-label text-muted small">偏好技能</label>
                            <div>
                                {preferredSkills.length > 0 ? preferredSkills.map((skill: string) => <span key={skill} className="badge bg-secondary me-1 mb-1 p-2">{skill}</span>) : <p className="text-muted">未提供</p>}
                            </div>
                            <hr/>
                             <h6 className="mb-3"><i className="bi bi-sliders text-primary me-2"></i>評分權重</h6>
                             <div className="mb-3">
                                <label className="form-label">技能權重</label>
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar" style={{width: `${weights.skills}%`}} aria-valuenow={weights.skills} aria-valuemin={0} aria-valuemax={100}>{weights.skills}%</div>
                                </div>
                             </div>
                             <div className="mb-3">
                                <label className="form-label">經驗權重</label>
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar" style={{width: `${weights.experience}%`}} aria-valuenow={weights.experience} aria-valuemin={0} aria-valuemax={100}>{weights.experience}%</div>
                                </div>
                             </div>
                             <div>
                                <label className="form-label">學歷權重</label>
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar" style={{width: `${weights.education}%`}} aria-valuenow={weights.education} aria-valuemin={0} aria-valuemax={100}>{weights.education}%</div>
                                </div>
                             </div>
                        </div>
                    </div>
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
const RequirementsStep = ({ initialData, onFormSubmit }: { initialData: RequirementData, onFormSubmit: (data: RequirementData) => void }) => {
    const [skillsWeight, setSkillsWeight] = useState(initialData.weights.skills);
    const [experienceWeight, setExperienceWeight] = useState(initialData.weights.experience);
    const [educationWeight, setEducationWeight] = useState(initialData.weights.education);
    const [requiredSkills, setRequiredSkills] = useState(initialData.requiredSkills);
    const [preferredSkills, setPreferredSkills] = useState(initialData.preferredSkills);
    const [requiredSkillInput, setRequiredSkillInput] = useState('');
    const [preferredSkillInput, setPreferredSkillInput] = useState('');

    const [formData, setFormData] = useState(initialData.formData);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation
        if (!formData.jobTitle.trim()) {
            alert('「職位名稱」是必填欄位。');
            return;
        }
        if (!formData.school.trim()) {
            alert('「期望學校」是必填欄位。');
            return;
        }
        if (!formData.educationRequirements.trim()) {
            alert('「現時學歷」是必填欄位。');
            return;
        }
        if (requiredSkills.length === 0) {
            alert('請至少新增一項「必要技能」。');
            return;
        }
    
        const fullFormData = {
            formData,
            requiredSkills,
            preferredSkills,
            weights: {
                skills: skillsWeight,
                experience: experienceWeight,
                education: educationWeight
            }
        };
        onFormSubmit(fullFormData);
    };

    const handleWeightChange = (
        changedKey: 'skills' | 'experience' | 'education',
        newValue: number
      ) => {
        newValue = Math.max(0, Math.min(100, parseInt(newValue.toString(), 10)));
    
        const currentWeights = {
            skills: skillsWeight,
            experience: experienceWeight,
            education: educationWeight,
        };
    
        if (currentWeights[changedKey] === newValue) return;
    
        const otherKeys = (['skills', 'experience', 'education'] as const).filter(
          k => k !== changedKey
        );
        const oldSumOfOthers = otherKeys.reduce((sum, key) => sum + currentWeights[key], 0);
        const newSumOfOthers = 100 - newValue;
    
        const newWeights = { ...currentWeights, [changedKey]: newValue };
    
        if (oldSumOfOthers > 0) {
            const ratio = newWeights[otherKeys[0]] / oldSumOfOthers;
            newWeights[otherKeys[0]] = Math.round(newSumOfOthers * ratio);
            newWeights[otherKeys[1]] = newSumOfOthers - newWeights[otherKeys[0]];
        } else {
            newWeights[otherKeys[0]] = Math.floor(newSumOfOthers / 2);
            newWeights[otherKeys[1]] = Math.ceil(newSumOfOthers / 2);
        }
    
        setSkillsWeight(newWeights.skills);
        setExperienceWeight(newWeights.experience);
        setEducationWeight(newWeights.education);
      };

    const handleAddSkill = (
        skill: string,
        skills: string[],
        setSkills: React.Dispatch<React.SetStateAction<string[]>>,
        setInput: React.Dispatch<React.SetStateAction<string>>
    ) => {
        const trimmedSkill = skill.trim();
        if (trimmedSkill && !skills.includes(trimmedSkill)) {
            setSkills([...skills, trimmedSkill]);
            setInput('');
        }
    };

    const handleRemoveSkill = (
        skillToRemove: string,
        skills: string[],
        setSkills: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-light">
                        <h5 className="mb-0"><i className="bi bi-journal-text me-2 text-primary"></i>基本資訊</h5>
                    </div>
                    <div className="card-body p-4">
                        <div className="mb-3">
                            <label htmlFor="jobTitle" className="form-label">姓名<span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="jobTitle" placeholder="例如：陳大文" value={formData.jobTitle} onChange={handleInputChange} />
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-light">
                         <h5 className="mb-0"><i className="bi bi-mortarboard me-2 text-primary"></i>學術要求</h5>
                    </div>
                    <div className="card-body p-4">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="school" className="form-label">期望學校 (School) <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" id="school" placeholder="e.g. National Taiwan University" value={formData.school} onChange={handleInputChange} />
                            </div>
                             <div className="col-md-6 mb-3">
                                <label htmlFor="department" className="form-label">期望學系 (Department)</label>
                                <input type="text" className="form-control" id="department" placeholder="e.g. Computer Science" value={formData.department} onChange={handleInputChange} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="grade" className="form-label">晉升年級(Grade)</label>
                                <input type="text" className="form-control" id="grade" placeholder="e.g. 3th year" value={formData.grade} onChange={handleInputChange} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="educationRequirements" className="form-label">現時學歷<span className="text-danger">*</span></label>
                                <input type="text" className="form-control" id="educationRequirements" placeholder="例如：中學學位" value={formData.educationRequirements} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm mb-4">
                     <div className="card-header bg-light">
                        <h5 className="mb-0"><i className="bi bi-star me-2 text-primary"></i>技能要求</h5>
                    </div>
                    <div className="card-body p-4">
                        <div className="mb-3">
                            <label className="form-label">必要技能 <span className="text-danger">*</span></label>
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="新增一項必要技能"
                                    value={requiredSkillInput}
                                    onChange={(e) => setRequiredSkillInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddSkill(requiredSkillInput, requiredSkills, setRequiredSkills, setRequiredSkillInput);
                                        }
                                    }}
                                />
                                <button className="btn btn-primary" type="button" onClick={() => handleAddSkill(requiredSkillInput, requiredSkills, setRequiredSkills, setRequiredSkillInput)}><i className="bi bi-plus-lg"></i></button>
                            </div>
                            <div className="mt-2 d-flex flex-wrap" style={{minHeight: '40px'}}>
                                {requiredSkills.length > 0 ? (
                                    requiredSkills.map((skill: string) => (
                                        <span key={skill} className="badge fs-6 fw-normal bg-primary me-2 mb-2 p-2 d-flex align-items-center">
                                            {skill}
                                            <button 
                                                type="button" 
                                                className="btn-close btn-close-white ms-2" 
                                                style={{fontSize: '0.65em'}} 
                                                onClick={() => handleRemoveSkill(skill, requiredSkills, setRequiredSkills)}>
                                            </button>
                                        </span>
                                    ))
                                ) : (
                                    <div className="form-text p-2">尚未新增必要技能</div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="form-label">偏好技能</label>
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="新增一項偏好技能"
                                    value={preferredSkillInput}
                                    onChange={(e) => setPreferredSkillInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddSkill(preferredSkillInput, preferredSkills, setPreferredSkills, setPreferredSkillInput);
                                        }
                                    }}
                                />
                                <button className="btn btn-primary" type="button" onClick={() => handleAddSkill(preferredSkillInput, preferredSkills, setPreferredSkills, setPreferredSkillInput)}><i className="bi bi-plus-lg"></i></button>
                            </div>
                           <div className="mt-2 d-flex flex-wrap" style={{minHeight: '40px'}}>
                                {preferredSkills.length > 0 ? (
                                    preferredSkills.map((skill: string) => (
                                        <span key={skill} className="badge fs-6 fw-normal bg-secondary me-2 mb-2 p-2 d-flex align-items-center">
                                            {skill}
                                            <button 
                                                type="button" 
                                                className="btn-close btn-close-white ms-2" 
                                                style={{fontSize: '0.65em'}} 
                                                onClick={() => handleRemoveSkill(skill, preferredSkills, setPreferredSkills)}>
                                            </button>
                                        </span>
                                    ))
                                ) : (
                                    <div className="form-text p-2">尚未新增偏好技能</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm mb-4">
                     <div className="card-header bg-light">
                        <h5 className="mb-0"><i className="bi bi-gem me-2 text-primary"></i>其他要求與權重</h5>
                    </div>
                    <div className="card-body p-4">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="mb-3">
                                    <label htmlFor="experienceRequirements" className="form-label">經驗</label>
                                    <input type="text" className="form-control" id="experienceRequirements" placeholder="例如：比賽" value={formData.experienceRequirements} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label htmlFor="additionalNotes" className="form-label">其他備註</label>
                                    <textarea className="form-control" id="additionalNotes" rows={5} placeholder="任何關於此職位的額外要求或說明" value={formData.additionalNotes} onChange={handleInputChange}></textarea>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <h6 className="mb-3">評分標準權重</h6>
                                <p className="text-muted small">調整各個評分項目的重要性，總權重將維持 100%。</p>
                                <div className="mb-3">
                                    <label htmlFor="skillsWeight" className="form-label">技能權重: {skillsWeight}%</label>
                                    <input type="range" className="form-range" id="skillsWeight" min="0" max="100" value={skillsWeight} onChange={(e) => handleWeightChange('skills', parseInt(e.target.value))} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="experienceWeight" className="form-label">經驗權重: {experienceWeight}%</label>
                                    <input type="range" className="form-range" id="experienceWeight" min="0" max="100" value={experienceWeight} onChange={(e) => handleWeightChange('experience', parseInt(e.target.value))} />
                                </div>
                                <div>
                                    <label htmlFor="educationWeight" className="form-label">學歷權重: {educationWeight}%</label>
                                    <input type="range" className="form-range" id="educationWeight" min="0" max="100" value={educationWeight} onChange={(e) => handleWeightChange('education', parseInt(e.target.value))} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn btn-primary btn-lg px-5">
                        <i className="bi bi-arrow-right-circle-fill me-2"></i>
                        建立並預覽要求
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
    if (!submittedRequirements || uploadedFiles.length === 0) {
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

        // 遞交成功後自動比對學長
        const matchFormData = new FormData();
        matchFormData.append('resume', uploadedFiles[0]);
        matchFormData.append('school', submittedRequirements.formData.school);
        matchFormData.append('grade', submittedRequirements.formData.grade);
        matchFormData.append('education', submittedRequirements.formData.educationRequirements);
        matchFormData.append('experience', submittedRequirements.formData.experienceRequirements);
        matchFormData.append('skills', submittedRequirements.requiredSkills.join(','));
        matchFormData.append('name', submittedRequirements.formData.jobTitle);

        const matchRes = await fetch('/api/match-alumni', {
          method: 'POST',
          body: matchFormData,
        });
        const { alumni } = await matchRes.json();
        setMatchedAlumni(alumni);

        setCurrentStep(4); // 跳到查看結果
        alert('已成功遞交！');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSubmissionError(error.message);
        alert(`發生錯誤： ${error.message}`);
      } else {
        setSubmissionError('未知錯誤');
        alert('發生未知錯誤');
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
    switch (currentStep) {
      case 1:
        return <UploadStep files={uploadedFiles} onFilesChange={setUploadedFiles} onNext={() => setCurrentStep(2)} />;
      case 2:
        return <RequirementsStep initialData={requirementsState} onFormSubmit={handleRequirementSubmit} />;
      case 3:
        return <SavedRequirementsStep 
                    requirements={submittedRequirements} 
                    files={uploadedFiles} 
                    onEdit={() => setCurrentStep(2)} 
                    onSubmit={finalSubmit}
                    isSubmitting={isSubmitting}
                    submissionError={submissionError} 
                />;
      case 4:
        return (
          <div>
            <h4 className="mb-4 text-center">最相似的學長</h4>
            {matchedAlumni && matchedAlumni.length > 0 ? (
              matchedAlumni.slice(0, 3).map(a => (
                <div key={a.id} className="card mb-3">
                  <div className="card-body">
                    <h5>{a.name}（{a.school} {a.department}）</h5>
                    <p>年級：{a.grade}，學歷：{a.education}</p>
                    <p>經驗：{a.experience}</p>
                    <p>技能：{a.skills?.join('、')}</p>
                    <p>履歷摘要：{a.resume_content?.slice(0, 100)}...</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-info">查無相似學長</div>
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