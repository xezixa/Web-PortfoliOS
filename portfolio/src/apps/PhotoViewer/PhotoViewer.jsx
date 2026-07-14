import React from 'react';
import './PhotoViewer.css';

function PhotoViewer({ photo, onSetBackground }) {
    if (!photo) return null;

    const displayName = photo.id ? `${photo.id.toUpperCase()}.JPG` : 'IMAGE.JPG';

    return (
        <div className="viewer-container">
            <div className="viewer-header">
                    <span className="file-name">{displayName}</span>
                    <button className="xp-button" onClick={() => onSetBackground && onSetBackground(photo.url)}>
                        Set as Background
                    </button>
            </div>

            <div className="viewer-main">
                <div className="photo-frame">
                    <img src={photo.url} alt={displayName} />
                </div>
            </div>
            
            <div className="viewer-main-bottom-border"></div>

            <div className="viewer-footer-pane">
                <div className="footer-row upper-caption-row">
                    <span className="caption-text">Skyline View from the top of 830 Main St. </span>
                </div>

                <div className="footer-full-divider"></div>

                <div className="footer-row metadata-status-row">
                    <div className="meta-zone zone-left">
                        Date Captured: {photo.date || 'N/A'}
                    </div>

                    <div className="meta-vertical-divider"></div>

                    <div className="meta-zone zone-middle">
                        ISO {photo.iso || 'N/A'}&nbsp;&nbsp;&nbsp;&nbsp;
                        f/{photo.aperture || 'N/A'}&nbsp;&nbsp;&nbsp;&nbsp;
                        {photo.shutter || 'N/A'}&nbsp;&nbsp;&nbsp;&nbsp;
                        {photo.focal || 'N/A'}
                    </div>

                    <div className="meta-vertical-divider"></div>

                    <div className="meta-zone zone-right">
                        {photo.camera || 'Unknown Camera'}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PhotoViewer;