import React from 'react';
import './AboutSect.css';

function AboutSect({ onClose }) {
    return (
        <div className="about-sect-container">
            <div className="main-content-wrapper">
                <div className="user-info-section">
                    <div className="avatar-col">
                        <div className="avatar-box">
                            <svg viewBox="0 0 24 24" width="60" height="60" fill="#666"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        </div>
                        <div className="dob-text">09/16/2002</div>
                    </div>
                    <div className="info-divider"></div>
                    <div className="details-col">
                        <div className="info-heading">User Information:</div>
                        <div className="info-body">
                            Chase Bezilla<br />
                            Burlington, KY<br /><br />
                            BlueStar, inc.<br />
                            ServiceDesk Technician
                        </div>
                    </div>
                </div>

                <div className="description-section">
                    <div className="desc-heading">Description:</div>
                    <div className="desc-text-box">
                        "Hi! I'm Chase, a photographer and digital artist pursuing a career in tech. My goal is to express creativity through technology.<br /><br />
                        I currently work as an IT technician, but have interests in pursuing System Administration, web/app development, cyber-security, AI, and digital marketing.<br /><br />
                        Photography isn't my only creative outlet. I have experience with videography, music production, guitar, piano, and more."
                    </div>
                </div>
            </div>

            <div className="footer-area">
                <button className="win7-btn" onClick={onClose}>OK</button>
                <button className="win7-btn" onClick={onClose}>Cancel</button>
                <button className="win7-btn" disabled>Apply</button>
            </div>
        </div>
    );
}

export default AboutSect;