import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout'; // Assuming a Layout component exists

// Step 1: Upload Resumes Component
const allowedTypes = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const maxFileSize = 5 * 1024 * 1024; // 5MB

const UploadStep = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newFiles: File[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (!allowedTypes.includes(file.type)) {
        setError('Only PDF, TXT, DOC, and DOCX files are allowed.');
        continue;
      }
      if (file.size > maxFileSize) {
        setError('Each file must be less than 5MB.');
        continue;
      }
      // Prevent duplicate file names
      if (files.some(f => f.name === file.name)) continue;
      newFiles.push(file);
    }
    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
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
    setFiles(prev => prev.filter(f => f.name !== name));
  };

  return (
    <div>
      <h4 className="mb-4">Upload Resumes</h4>
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{
          border: '2px dashed #ccc',
          borderRadius: '10px',
          padding: '50px',
          textAlign: 'center',
          background: '#fafbfc',
          cursor: 'pointer',
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('resume-upload-input')?.click()}
      >
        <i className="bi bi-upload fs-1 text-primary"></i>
        <h5 className="mt-3">Drag & drop resumes here, or click to select</h5>
        <p className="text-muted">Supports PDF, TXT, DOC, and DOCX files (max 5MB each)</p>
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
          <h6>Uploaded Files:</h6>
          <ul className="list-group">
            {files.map(file => (
              <li key={file.name} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{file.name}</span>
                <button className="btn btn-sm btn-outline-danger" onClick={() => removeFile(file.name)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="alert alert-warning mt-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          No resumes uploaded. Upload at least one resume to proceed with the evaluation.
        </div>
      )}
    </div>
  );
};

// Step 2: Job Requirements Component
const RequirementsStep = () => {
    const [skillsWeight, setSkillsWeight] = useState(50);
    const [experienceWeight, setExperienceWeight] = useState(30);
    const [educationWeight, setEducationWeight] = useState(20);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <ul className="nav nav-pills">
                    <li className="nav-item">
                        <a className="nav-link active" href="#">Create New Requirement</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Manage Requirements (0)</a>
                    </li>
                </ul>
            </div>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title mb-4">Job Requirement Details</h5>
                    <form>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="jobTitle" className="form-label">Job Title</label>
                                <input type="text" className="form-control" id="jobTitle" placeholder="e.g. Senior Frontend Developer" />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="jobDescription" className="form-label">Job Description</label>
                            <textarea className="form-control" id="jobDescription" rows={3} placeholder="Enter a brief description of the job role and responsibilities"></textarea>
                        </div>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label htmlFor="school" className="form-label">學校 (School)</label>
                                <input type="text" className="form-control" id="school" placeholder="e.g. National Taiwan University" />
                            </div>
                             <div className="col-md-4 mb-3">
                                <label htmlFor="department" className="form-label">大學生學系 (Department)</label>
                                <input type="text" className="form-control" id="department" placeholder="e.g. Computer Science" />
                            </div>
                             <div className="col-md-4 mb-3">
                                <label htmlFor="grade" className="form-label">年級 (Grade)</label>
                                <input type="text" className="form-control" id="grade" placeholder="e.g. 4th year" />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Required Skills</label>
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Add a required skill"/>
                                <button className="btn btn-outline-primary" type="button">+</button>
                            </div>
                            <div className="form-text">No required skills added yet</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Preferred Skills</label>
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Add a preferred skill"/>
                                <button className="btn btn-outline-primary" type="button">+</button>
                            </div>
                            <div className="form-text">No preferred skills added yet</div>
                        </div>
                         <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="experienceRequirements" className="form-label">Experience Requirements</label>
                                <input type="text" className="form-control" id="experienceRequirements" placeholder="e.g. 3+ years of experience with React" />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="educationRequirements" className="form-label">Education Requirements</label>
                                <input type="text" className="form-control" id="educationRequirements" placeholder="e.g. Bachelor's degree in Computer Science or related field" />
                            </div>
                        </div>
                         <div className="mb-3">
                            <label htmlFor="additionalNotes" className="form-label">Additional Notes</label>
                            <textarea className="form-control" id="additionalNotes" rows={2} placeholder="Any additional requirements or notes about the position"></textarea>
                        </div>

                        <hr className="my-4" />

                        <h5 className="mb-3">Evaluation Criteria Weights</h5>
                        <p className="text-muted">Adjust the importance of each factor in the overall evaluation. The total will always equal 100%.</p>

                        <div className="mb-3">
                            <label htmlFor="skillsWeight" className="form-label">Skills Weight: {skillsWeight}%</label>
                            <input type="range" className="form-range" id="skillsWeight" min="0" max="100" value={skillsWeight} onChange={(e) => setSkillsWeight(parseInt(e.target.value))} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="experienceWeight" className="form-label">Experience Weight: {experienceWeight}%</label>
                            <input type="range" className="form-range" id="experienceWeight" min="0" max="100" value={experienceWeight} onChange={(e) => setExperienceWeight(parseInt(e.target.value))} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="educationWeight" className="form-label">Education Weight: {educationWeight}%</label>
                            <input type="range" className="form-range" id="educationWeight" min="0" max="100" value={educationWeight} onChange={(e) => setEducationWeight(parseInt(e.target.value))} />
                        </div>


                        <button type="submit" className="btn btn-primary float-end mt-3">Create Job Requirement</button>
                    </form>
                </div>
            </div>
        </div>
    );
};


const DocumentComparisonPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = ['Upload Resumes', 'Job Requirements', 'Saved Requirements', 'View Results'];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <UploadStep />;
      case 2:
        return <RequirementsStep />;
      // Add cases for other steps here
      default:
        return <div>Step not found</div>;
    }
  };


  // NOTE: This is a placeholder for auth logic.
  // You should replace this with your actual authentication check.
  const isStudent = true; 

  if (!isStudent) {
    return (
      <Layout title="Access Denied">
        <div className="container py-5 text-center">
          <h2>Access Denied</h2>
          <p>You must be logged in as a student to view this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="AI Resume Evaluation System">
      <Head>
        <title>AI Resume Evaluation System</title>
         {/* You might need to add Bootstrap CSS if not globally available */}
         {/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" /> */}
         {/* <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" /> */}
      </Head>

      <div className="container-fluid bg-light py-5">
        <div className="container text-center">
            <h1 className="display-5">AI Resume Evaluation System</h1>
            <p className="lead">
                Compare multiple resumes against various job requirements, customize evaluation criteria, and generate detailed AI-powered analysis reports.
            </p>
        </div>
      </div>

      <div className="container py-5">
        {/* Stepper/Wizard Navigation */}
        <div className="row g-4 mb-5">
          {steps.map((title, index) => (
             <div key={index} className="col-md-3" onClick={() => setCurrentStep(index + 1)} style={{cursor: 'pointer'}}>
                <div className={`card h-100 ${currentStep === index + 1 ? 'border-primary' : ''}`}>
                    <div className="card-body text-center">
                        <h5 className={`card-title ${currentStep === index + 1 ? 'text-primary' : ''}`}>{`${index + 1}. ${title}`}</h5>
                    </div>
                </div>
            </div>
          ))}
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