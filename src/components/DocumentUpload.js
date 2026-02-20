import React, { useState } from 'react';

function DocumentUpload({ onComplete }) {
  const [documents, setDocuments] = useState({
    idDocument: null,
    proofOfIncome: null,
    bankStatement: null,
    proofOfResidence: null
  });

  const [uploadProgress, setUploadProgress] = useState({});

  const handleFileChange = (docType, file) => {
    setDocuments(prev => ({ ...prev, [docType]: file }));
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(prev => ({ ...prev, [docType]: progress }));
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const getDocumentStatus = (docType) => {
    if (!documents[docType]) return 'pending';
    if (uploadProgress[docType] === 100) return 'complete';
    return 'uploading';
  };

  const allDocumentsComplete = () => {
    return Object.keys(documents).every(key => getDocumentStatus(key) === 'complete');
  };

  const documentRequirements = [
    {
      type: 'idDocument',
      label: 'Valid ID Document',
      description: 'Passport, Driver\'s License, or National ID',
      acceptedFormats: '.pdf,.jpg,.jpeg,.png'
    },
    {
      type: 'proofOfIncome',
      label: 'Proof of Income',
      description: 'Recent payslips (last 3 months) or bank statements',
      acceptedFormats: '.pdf,.jpg,.jpeg,.png'
    },
    {
      type: 'bankStatement',
      label: 'Bank Statement',
      description: 'Last 6 months bank statement',
      acceptedFormats: '.pdf,.jpg,.jpeg,.png'
    },
    {
      type: 'proofOfResidence',
      label: 'Proof of Residence',
      description: 'Utility bill or lease agreement (not older than 3 months)',
      acceptedFormats: '.pdf,.jpg,.jpeg,.png'
    }
  ];

  return (
    <div className="card">
      <h2 className="form-title">Document Upload</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
        Please upload the required documents for your loan application
      </p>

      <div style={{ marginBottom: '2rem' }}>
        {documentRequirements.map((req, index) => {
          const status = getDocumentStatus(req.type);
          
          return (
            <div
              key={req.type}
              style={{
                marginBottom: '1.5rem',
                padding: '1.5rem',
                background: '#f8f9fa',
                borderRadius: '10px',
                border: `2px solid ${
                  status === 'complete' ? '#28a745' : 
                  status === 'uploading' ? '#ffc107' : '#FF8C5A'
                }`,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div>
                  <h3 style={{ color: '#C41E3A', marginBottom: '0.3rem' }}>
                    {req.label}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    {req.description}
                  </p>
                </div>
                <div>
                  <span style={{
                    padding: '0.3rem 1rem',
                    borderRadius: '20px',
                    background: status === 'complete' ? '#d4edda' : 
                               status === 'uploading' ? '#fff3cd' : '#f8d7da',
                    color: status === 'complete' ? '#155724' : 
                           status === 'uploading' ? '#856404' : '#721c24',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {status === 'complete' ? 'Uploaded' : 
                     status === 'uploading' ? 'Uploading...' : 'Pending'}
                  </span>
                </div>
              </div>

              {status === 'pending' && (
                <div>
                  <input
                    type="file"
                    accept={req.acceptedFormats}
                    onChange={(e) => handleFileChange(req.type, e.target.files[0])}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px dashed #FFB347',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  />
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                    Accepted formats: PDF, JPG, JPEG, PNG (Max 5MB)
                  </p>
                </div>
              )}

              {status === 'uploading' && (
                <div>
                  <div style={{
                    height: '8px',
                    background: '#e0e0e0',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{
                      width: `${uploadProgress[req.type]}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #FF6B35, #28a745)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    Uploading... {uploadProgress[req.type]}%
                  </p>
                </div>
              )}

              {status === 'complete' && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#28a745' }}>✓ {documents[req.type]?.name}</span>
                  <button
                    onClick={() => setDocuments(prev => ({ ...prev, [req.type]: null }))}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc3545',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{
        background: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '10px',
        marginBottom: '2rem',
        border: '2px solid #FFB347'
      }}>
        <h3 style={{ color: '#C41E3A', marginBottom: '1rem' }}>
          Upload Progress
        </h3>
        <div style={{
          height: '12px',
          background: '#e0e0e0',
          borderRadius: '6px',
          overflow: 'hidden',
          marginBottom: '0.5rem'
        }}>
          <div style={{
            width: `${(Object.values(documents).filter(d => d !== null).length / 4) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #FF6B35, #28a745)',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <p style={{ textAlign: 'center', color: '#666' }}>
          {Object.values(documents).filter(d => d !== null).length} of 4 documents uploaded
        </p>
      </div>

      <button
        onClick={onComplete}
        disabled={!allDocumentsComplete()}
        style={{
          width: '100%',
          padding: '1rem',
          background: 'linear-gradient(135deg, #FF6B35, #C41E3A)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: allDocumentsComplete() ? 'pointer' : 'not-allowed',
          opacity: allDocumentsComplete() ? 1 : 0.5
        }}
      >
        Submit Documents
      </button>
    </div>
  );
}

export default DocumentUpload;