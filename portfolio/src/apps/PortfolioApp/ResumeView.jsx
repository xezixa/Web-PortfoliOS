import React from 'react';
import './ResumeView.css';

function ResumeView({ onClose }) {
    
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = './Resume-Chase-Bezilla.pdf';
        link.download = 'resume_chase_bezilla.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
        <div className="resume-container">
            <div className="resume-header">
                <div className="resume-divider"></div>
                <span className="resume-title">resume_chase_bezilla.pdf</span>
                <div className="resume-divider"></div>
            </div>
            
            <div className="resume-viewer-body">
                <div className="resume-preview-card">
                    <img
                        src="/res-prev.png"
                        alt="resume"
                    />
                </div>
            </div>
            
            <div className="resume-footer">
                <button className="win-btn" onClick={handleDownload}>
                    Save to Device
                </button>
            </div>
        </div>
    );
}

export default ResumeView;