import React, { useEffect, useRef } from 'react';
import './StartMenu.css';

const StartMenu = ({ isOpen, onClose }) => {
    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isOpen && menuRef.current && !menuRef.current.contains(e.target)) {
                
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
    
    const leftLinks = [
        { label: 'About Me', icon: '/aboutme.png' },
        { label: 'View Resume', icon: '/Notepad_WinXP.png' },
        { label: 'Contact Me', icon: '/contact.png' },

    ];
    
    const rightLinks = [
        { label: 'Device Manager', icon: '/Device-Manager-Icon.png' },
        { label: 'My Pictures', icon: '/photofolder2.png' },
        { type: 'separator' },
        { label: 'Recycle Bin', icon: '/recyc-full.png' },
        { label: 'System Properties', icon: '/SysProperties.png' },
    ];
    
    return (
        <div className="start-menu-container" ref={menuRef}>
            <div className="start-menu-header">
                <h2>Chase Bezilla</h2>
            </div>
            
            <div className="start-menu-body">
                <div className="menu-left">
                    {leftLinks.map(link => (
                        <div className="menu-item" key={link.label}>
                            <img src={link.icon} alt={link.label} />
                            <span>{link.label}</span>
                        </div>
                    ))}
                </div>
                
                <div className="menu-right">
                    {rightLinks.map((link, index) => (
                        link.type === 'separator' ?
                            <hr key={index} className="menu-separator" /> :
                            <div className="menu-item" key={link.label}>
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