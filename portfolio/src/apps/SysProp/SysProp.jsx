import React from 'react';
import './SysProp.css';

export default function SysProp({ onClose }) {
    return (
        <div className="sysprop-container">
            <div className="sysprop-content-box">

                <div className="sysprop-top-section">
                    <img src="/MyPC.png" alt="My PC" className="sysprop-pc-icon" />
                    <div className="sysprop-text-block">
                        <div className="label">System:</div>
                        <div className="value indent">
                            Bezilla WebOS<br />
                            Portfolio<br />
                            Version 1.0<br />
                            2026
                        </div>
                        <div className="label spacer">Domain:</div>
                        <div className="value indent">https://www.google.com/</div>
                    </div>
                </div>

                <div className="sysprop-divider" />

                <div className="sysprop-storage-section">
                    <div className="storage-row">
                        <div className="color-box blue"></div>
                        <span className="storage-label">Used space:</span>
                        <span className="storage-bytes">242,665,652,224 bytes</span>
                        <span className="storage-gb">227.6 GB</span>
                    </div>
                    <div className="storage-row">
                        <div className="color-box pink"></div>
                        <span className="storage-label">Free space:</span>
                        <span className="storage-bytes">30,279,519,436 bytes</span>
                        <span className="storage-gb">28.2 GB</span>
                    </div>
                </div>

                <div className="sysprop-divider" />

                <div className="sysprop-capacity-section">
                    <span className="capacity-label">Capacity:</span>
                    <span className="storage-bytes">274,877,906,944 bytes</span>
                    <span className="storage-gb">255.8 GB</span>
                </div>

                <div className="sysprop-pie-wrapper">
                    <div className="sysprop-pie-chart"></div>
                    <div className="pie-label">Drive C</div>
                </div>

                <div className="sysprop-divider" />

                <div className="sysprop-credits-section">
                    <div className="credits-label">Designed and Developed by:</div>
                    <div className="credits-value">
                        Coded in HTML, CSS & ReactJS<br />
                        Designed in Adobe Xd<br />
                        Completed in XXX days<br /><br />
                        Windows .ico by marchmountain
                    </div>
                </div>
            </div>

            <div className="sysprop-footer">
                <button className="sysprop-btn" onClick={onClose}>OK</button>
                <button className="sysprop-btn" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}