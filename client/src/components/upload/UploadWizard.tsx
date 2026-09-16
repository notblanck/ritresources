import React, { useState, useRef } from 'react';
import { useToast } from '../../context/ToastContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { createResourceApi } from '../../services/api.js';

interface UploadWizardProps {
  onSuccess: () => void;
}

export const UploadWizard: React.FC<UploadWizardProps> = ({ onSuccess }) => {
  const { showToast } = useToast();
  const { user } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Form State
  const [type, setType] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [dept, setDept] = useState<string>('');
  const [sem, setSem] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [visibility, setVisibility] = useState<string>('Visible to all students');
  const [agreed, setAgreed] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateStep1 = (): boolean => {
    if (!type || !title.trim()) {
      showToast('Please select a resource type and enter a title.');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!file) {
      showToast('Please choose a file to upload.');
      return false;
    }
    return true;
  };

  const handleNext = (nextStep: number) => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    const kb = bytes / 1024;
    if (kb > 1024) return (kb / 1024).toFixed(1) + ' MB';
    return kb.toFixed(0) + ' KB';
  };

  const handleSubmit = async () => {
    if (!agreed) {
      showToast('Please agree to the terms and conditions.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('type', type);
      formData.append('subject', subject.trim() || 'General');
      formData.append('dept_id', dept || 'CSE');
      formData.append('semester', sem || '1st Year');
      formData.append('description', desc.trim());
      formData.append('visibility', visibility);
      formData.append('uploader_name', user?.name || 'Anonymous Student');
      if (user?.email) formData.append('uploader_email', user.email);
      if (file) formData.append('file', file);

      await createResourceApi(formData);
      showToast('Resource submitted! It will appear on Browse Resources shortly.');

      // Reset form
      setType('');
      setTitle('');
      setSubject('');
      setDept('');
      setSem('');
      setDesc('');
      setAgreed(false);
      setFile(null);
      setStep(1);

      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err: any) {
      showToast(err.message || 'Error submitting resource. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrap" id="view-upload">
      <div className="page-header">
        <h2>Upload <span>Academic Resource</span></h2>
        <p>Share your notes, question papers, and solutions with fellow students across RIT.</p>
      </div>

      {/* Stepper Bar */}
      <div className="steps-bar">
        <div className={`step-node ${step === 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`} id="stepNode1">
          <div className="step-circle">{step > 1 ? '✓' : '1'}</div>
          <div className="step-label">Details</div>
        </div>
        <div className={`step-line ${step > 1 ? 'done' : ''}`} id="stepLine1" />
        <div className={`step-node ${step === 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`} id="stepNode2">
          <div className="step-circle">{step > 2 ? '✓' : '2'}</div>
          <div className="step-label">Upload File</div>
        </div>
        <div className={`step-line ${step > 2 ? 'done' : ''}`} id="stepLine2" />
        <div className={`step-node ${step === 3 ? 'active' : ''}`} id="stepNode3">
          <div className="step-circle">3</div>
          <div className="step-label">Review &amp; Submit</div>
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="upload-grid wizard-step" id="wizStep1">
          <div className="upload-card">
            <h3>Resource Details</h3>
            <div className="form-field">
              <label>Resource Type *</label>
              <select id="upType" value={type} onChange={(e) => setType(e.target.value)} required>
                <option value="">Select Resource Type</option>
                <option value="Notes">Notes / Lecture Material</option>
                <option value="Assignments">Assignments / Solutions</option>
                <option value="Previous Year Paper">Previous Year Question Paper (PYQ)</option>
                <option value="Important Questions">Important Questions / 2-Marks</option>
                <option value="Coding Resources">Coding Resources / Lab Programs</option>
              </select>
            </div>
            <div className="form-field">
              <label>Title *</label>
              <input
                type="text"
                id="upTitle"
                placeholder="e.g. Data Structures Unit 1 Complete Notes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label>Subject</label>
              <input
                type="text"
                id="upSubject"
                placeholder="e.g. Data Structures (CS3351)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Department</label>
              <select id="upDept" value={dept} onChange={(e) => setDept(e.target.value)}>
                <option value="">Select Department</option>
                <option value="CSBS">CSBS</option>
                <option value="CSE">CSE</option>
                <option value="AIDS">AI &amp; DS</option>
                <option value="AIML">AI &amp; ML</option>
                <option value="VLSI">VLSI Design</option>
              </select>
            </div>
            <div className="form-field">
              <label>Semester / Year</label>
              <select id="upSem" value={sem} onChange={(e) => setSem(e.target.value)}>
                <option value="">Select Semester or Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            <div className="form-field">
              <label>Description (Optional)</label>
              <textarea
                id="upDesc"
                placeholder="Add a short description about this resource..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
          </div>
          <div className="upload-card">
            <h3>Tips for a great upload</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: '1.8' }}>
              • Use a clear, specific title (e.g. "DBMS Unit 3 Normalization Notes") so classmates can find it fast.<br /><br />
              • Double-check you've picked the right department and semester — resources are filtered by these on the Browse page.<br /><br />
              • A one-line description helps others know exactly what's inside before downloading.
            </p>
          </div>
          <div className="wizard-actions">
            <span />
            <button className="btn btn-primary" onClick={() => handleNext(2)}>
              Next: Upload File →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="upload-grid wizard-step" id="wizStep2">
          <div className="upload-card" style={{ gridColumn: '1/-1' }}>
            <h3>Upload File</h3>
            <div
              className={`dropzone ${isDragOver ? 'drag' : ''}`}
              id="dropzone"
              onDragEnter={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M7 18a5 5 0 0 1-1-9.9A6 6 0 0 1 18 8a4.5 4.5 0 0 1-.5 9H7z" />
                <path d="M12 12v6M9 15l3-3 3 3" />
              </svg>
              <div className="dz-title">Drag and drop your file here</div>
              <div className="dz-sub">or</div>
              <button
                type="button"
                className="btn btn-secondary"
                id="chooseFileBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Choose File
              </button>
              <div className="dz-hint">PDF, DOC, DOCX, PPT, ZIP allowed (Max 50MB)</div>
              <input
                type="file"
                id="fileInput"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                onChange={handleFileSelect}
              />
            </div>

            {file && (
              <div id="fileChipWrap">
                <div className="file-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 3h9l5 5v13H6z" />
                    <path d="M9 12h6M9 16h6" />
                  </svg>
                  <span className="fname">{file.name} · {formatFileSize(file.size)}</span>
                  <span className="fremove" onClick={handleRemoveFile}>✕</span>
                </div>
              </div>
            )}
          </div>
          <div className="wizard-actions" style={{ gridColumn: '1/-1' }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>
              ← Back
            </button>
            <button className="btn btn-primary" onClick={() => handleNext(3)}>
              Next: Review &amp; Submit →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="upload-grid wizard-step" id="wizStep3">
          <div className="upload-card">
            <h3>Review Your Submission</h3>
            <div className="review-summary" id="reviewSummary">
              <div className="review-row"><span className="rk">Resource Type</span><span className="rv">{type || '—'}</span></div>
              <div className="review-row"><span className="rk">Title</span><span className="rv">{title || '—'}</span></div>
              <div className="review-row"><span className="rk">Subject</span><span className="rv">{subject || '—'}</span></div>
              <div className="review-row"><span className="rk">Department</span><span className="rv">{dept || '—'}</span></div>
              <div className="review-row"><span className="rk">Semester / Year</span><span className="rv">{sem || '—'}</span></div>
              <div className="review-row"><span className="rk">File</span><span className="rv">{file ? file.name : '—'}</span></div>
              <div className="review-row"><span className="rk">Description</span><span className="rv">{desc || '—'}</span></div>
            </div>
          </div>
          <div className="upload-card">
            <h3>Additional Information</h3>
            <div className="form-field">
              <label>Visibility</label>
              <select id="upVisibility" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                <option value="Visible to all students">Visible to all students</option>
                <option value="Visible to my department only">Visible to my department only</option>
                <option value="Visible to faculty only">Visible to faculty only</option>
              </select>
            </div>
            <div className="agree-row">
              <input
                type="checkbox"
                id="upAgree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label htmlFor="upAgree">
                I agree to the <a href="#terms" onClick={(e) => { e.preventDefault(); showToast('Academic code of conduct applies.'); }}>terms and conditions</a>
              </label>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              id="submitUpload"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Submitting Resource...' : 'Submit Resource'}
            </button>
          </div>
          <div className="wizard-actions" style={{ gridColumn: '1/-1' }}>
            <button className="btn btn-secondary" onClick={() => setStep(2)}>
              ← Back
            </button>
            <span />
          </div>
        </div>
      )}
    </div>
  );
};
