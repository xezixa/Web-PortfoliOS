import React from 'react';
import './PortfolioAppContent.css';
import ContactForm from './ContactForm';
import AboutSect from './AboutSect';
import ResumeView from "./ResumeView.jsx";
import MenuBar from './../../components/menuBar/menuBar';

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

    const galleryMenuConfig = [
        {
            label: '&File',
            items: [
                { label: 'Options...', disabled: true},
                { type: 'divider' },
                { label: 'Exit', onClick: () => console.log('Close clicked') }
            ]
        },
        {
            label: '&Edit',
            items: [
                {label: 'Undo', disabled: true},
                {label: 'Redo', disabled: true},
                {type: 'divider'},
                {label: 'Cut', disabled: true},
                {label: 'Copy', disabled: true},
                {label: 'Paste', disabled: true},
                {label: 'Paste Shortcut', disabled: true},
                {type: 'divider'},
                {label: 'Select All', disabled: true},
                {label: 'Invert Selection', disabled: true},

            ]
        },
        {
            label: '&Search',
            items: [
                { label: 'Help and Support Center' },
                { type: 'divider' },
                { label: 'Is this copy of PortfoliOS legal?' },
                { label: 'About PortfoliOS' },
            ]
        },
        {
            label: '&Help',
            items: [
                { label: 'Help and Support Center' },
                { type: 'divider' },
                { label: 'Is this copy of PortfoliOS legal?' },
                { label: 'About PortfoliOS' },
            ]
        },
    ];
    
    return (
        <div className="portfolio-app-container">
            <MenuBar config={galleryMenuConfig} />

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