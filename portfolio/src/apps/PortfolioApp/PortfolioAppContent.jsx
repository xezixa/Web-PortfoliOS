import React from 'react';
import './PortfolioAppContent.css';
import ContactForm from './ContactForm';
import AboutSect from './AboutSect';
import ResumeView from "./ResumeView.jsx";

function PortfolioAppContent({ onOpenWindow }) {

    const handleAction = (destination) => {
        if(destination === 'contact') {
            onOpenWindow({
                id: 'contact_app',
                title: 'Contact Me',
                iconSrc: '/contact.png',
                content: <ContactForm />,
                zIndex: 999,
                defaultY: 20,
                showMinimize: false,
                showMaximize: false,
                showHelp: true,
                onHelp: () => alert('Contact Me Help: This is a form to reach out to me!')
            }); 
        }
        else if (destination === 'about') {
            onOpenWindow({
                id: 'about_app',
                title: 'About Me',
                iconSrc: './aboutme.png',
                content: <AboutSect/>,
                width: 380,
                defaultX: 110,
                defaultY: 60,
                height: 500,
                zIndex: 999,
                showMinimize: false,
                showMaximize: false,
                showHelp: true
            });
        }
        
        else if (destination === 'resume') {
            onOpenWindow({
                id: 'resume-app',
                title: 'PDFView',
                iconSrc: './Notepad_WinXP.png',
                content: <ResumeView/>,
                width: 590,
                height: 720,
                defaultX: 790,
                zIndex: 999,
                showMinimize: true,
                showMaximize: true,
                showHelp: false
            });
        }
    }; 

    return (
        <div className="portfolio-app-container">
            <div className="portfolio-menu-bar">
                <span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>S</u>earch</span><span><u>H</u>elp</span>
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
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAction('about');
                        }}
                    >
                        about me
                    </button>
                    <button
                        className="portfolio-panel-btn"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAction('contact');
                        }}
                    >
                        contact
                    </button>
                    <button
                        className="portfolio-panel-btn"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                        e.stopPropagation();
                        handleAction('resume');
                        }}
                    >
                        resume
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PortfolioAppContent;