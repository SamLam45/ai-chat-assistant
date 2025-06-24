import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout'; // Assuming a Layout component exists

// Step 1: Upload Resumes Component
const UploadStep = () => (
  <div>
    <h4 className="mb-4">Upload Resumes</h4>
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        border: '2px dashed #ccc',
        borderRadius: '10px',
        padding: '50px',
        textAlign: 'center',
      }}
    >
      <i className="bi bi-upload fs-1 text-primary"></i> {/* Placeholder for an icon */}
      <h5 className="mt-3">Drag & drop resumes here, or click to select</h5>
      <p className="text-muted">Supports PDF, TXT, DOC, and DOCX files (max 5MB each)</p>
    </div>
    <div className="alert alert-warning mt-4" role="alert">
      <i className="bi bi-exclamation-triangle-fill me-2"></i> {/* Placeholder for an icon */}
      No resumes uploaded. Upload at least one resume to proceed with the evaluation.
    </div>
  </div>
);

// Step 2: Job Requirements Component
const RequirementsStep = () => (
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
                    <div className="mb-3">
                        <label htmlFor="school" className="form-label">學校 (School)</label>
                        <input type="text" className="form-control" id="school" placeholder="e.g. National Taiwan University" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="department" className="form-label">大學生學系 (Department)</label>
                        <input type="text" className="form-control" id="department" placeholder="e.g. Computer Science" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="grade" className="form-label">年級 (Grade)</label>
                        <input type="text" className="form-control" id="grade" placeholder="e.g. 4th year" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">所需技能 (Required Skills)</label>
                        {/* A proper skill input would require more complex state management */}
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Add a required skill"/>
                            <button className="btn btn-outline-primary" type="button">+</button>
                        </div>
                        <div className="form-text">No required skills added yet</div>
                    </div>

                     <div className="mb-4">
                        <label className="form-label">偏好技能 (Preferred Skills)</label>
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Add a preferred skill"/>
                            <button className="btn btn-outline-primary" type="button">+</button>
                        </div>
                        <div className="form-text">No preferred skills added yet</div>
                    </div>


                    <button type="submit" className="btn btn-primary float-end">Create Job Requirement</button>
                </form>
            </div>
        </div>
    </div>
);


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