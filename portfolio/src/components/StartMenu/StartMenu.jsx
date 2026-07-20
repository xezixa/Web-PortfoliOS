import React, { useEffect, useRef } from 'react';
import './StartMenu.css';
import AboutSect from '../../apps/PortfolioApp/AboutSect';
import ContactForm from '../../apps/PortfolioApp/ContactForm';
import ResumeView from '../../apps/PortfolioApp/ResumeView';

const StartMenu = ({ isOpen, onClose, onOpenWindow }) => {
    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isOpen && menuRef.current &&
                !menuRef.current.contains(e.target)) {

                if (e.target.closest('.taskbar-start-button')) {
                    return;
                }

                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);


    if (!isOpen) return null;

    const handleAppLaunch = (config) => {
        if (onOpenWindow) {
            onOpenWindow(config);
        }
        onClose();
    }

    const leftLinks = [
        {
            label: 'About Me',
            icon: '/aboutme.png',
            action: () => handleAppLaunch({
                id: 'about_app',
                title: 'About Me',
                iconSrc: '/aboutme.png',
                content: <AboutSect />,
                width: 380,
                defaultX: 110,
                defaultY: 60,
                height: 500,
                zIndex: 999,
                showMinimize: false,
                showMaximize: false,
                showHelp: true
            })
        },
        {
            label: 'View Resume',
            icon: '/Notepad_WinXP.png',
            action: () => handleAppLaunch({
                id: 'resume_app',
                title: 'PDFView',
                iconSrc: '/Notepad_WinXP.png',
                content: <ResumeView />,
                width: 590,
                height: 720,
                defaultX: 790,
                zIndex: 999,
                showMinimize: true,
                showMaximize: true,
                showHelp: false
            })
        },
        {
            label: 'Contact Me',
            icon: '/contact.png',
            action: () => handleAppLaunch({
                id: 'contact_app',
                title: 'Contact Me',
                iconSrc: '/contact.png',
                content: <ContactForm />,
                zIndex: 999,
                defaultY: 20,
                showMinimize: false,
                showMaximize: false,
                showHelp: true
            })
        },
    ];

    const rightLinks = [
        {
            label: 'Device Manager',
            icon: '/Device-Manager-Icon.png',
            action: () => handleAppLaunch({ id: 'technology_app', title: 'Device Manager', width: 700, height: 500, iconSrc: '/Device-Manager-Icon.png' })
        },
        {
            label: 'My Pictures',
            icon: '/photofolder2.png',
            action: () => handleAppLaunch({ id: 'gallery_app', title: 'My Pictures', width: 850, height: 600, iconSrc: '/photofolder2.png' })
        },
        {
            type: 'separator',
            label: 'separator',
            icon: '',
            action: null
        },
        {
            label: 'Recycle Bin',
            icon: '/recyc-full.png',
            action: () => handleAppLaunch({ id: 'recycle_bin', title: 'Recycle Bin', width: 600, height: 400, iconSrc: '/recyc-full.png', content: <div style={{ padding: '20px', fontFamily: 'Tahoma' }}>The Recycle Bin is currently empty.</div> })
        },
        {
            label: 'System Properties',
            icon: '/SysProperties.png',
            action: () => handleAppLaunch({ id: 'system_properties', title: 'System Properties', width: 450, height: 500, iconSrc: '/SysProperties.png', content: <div style={{ padding: '20px', fontFamily: 'Tahoma' }}>System Information coming soon.</div> })
        },
    ];

    return (
        <div className="start-menu-container" ref={menuRef}>
            <div className="start-menu-header">
                <h2>Chase Bezilla</h2>
            </div>

            <div className="start-menu-body">
                <div className="menu-left">
                    {leftLinks.map(link => (
                        <div className="menu-item" onClick={link.action} key={link.label}>
                            <img src={link.icon} alt={link.label} />
                            <span>{link.label}</span>
                        </div>
                    ))}
                </div>

                <div className="menu-right">
                    {rightLinks.map((link, index) => (
                        link.type === 'separator' ?
                            <hr key={index} className="menu-separator" /> :
                            <div className="menu-item" onClick={link.action} key={link.label}>
                                <img src={link.icon} alt={link.label} />
                                <span>{link.label}</span>
                            </div>
                    ))}
                </div>
            </div>
            <div className="start-menu-footer">
                <div className="shut-down-btn" onClick={onClose}>
                    <img src="/shutdown.png" alt="Shut Down" />
                    <span>Shut Down</span>
                </div>
            </div>
        </div>
    );
};

export default StartMenu;