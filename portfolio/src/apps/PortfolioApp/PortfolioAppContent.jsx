import React from 'react';
import './PortfolioAppContent.css';

function PortfolioAppContent() {
    const handleAction = (destination) => {
        console.log(`Navigating to ${destination}`);
    };
    
    return (
        <div className="portfolio-app-container">
            <div className="portfolio-menu-bar">
                <span className="menu-item">File</span>
                <span className="menu-item">Edit</span>
                <span className="menu-item">Search</span>
                <span className="menu-item">Help</span>
            </div>
            
            <div className="portfolio-workspace">
                <h1 className="portfolio-heading">
                    hello! i'm <span className="bold-name">chase bezilla</span>
                </h1>
                <p className="portfolio-subheading">
                    welcome to my <em>portfolio.</em>
                </p>
                
                <div className="portfolio-navigation-grid">
                    <button
                        className="portfolio-panel-btn"
                        onClick={() => handleAction('about')}
                        >
                        about me
                    </button>
                    <button
                        className="portfolio-panel-btn"
                        onClick={() => handleAction('contact')}
                        >
                        contact
                    </button>
                    <button
                        className="portfolio-panel-btn"
                        onClick={() => handleAction('resume')}
                        >
                        resume
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PortfolioAppContent;