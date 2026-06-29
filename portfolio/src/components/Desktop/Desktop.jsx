import { useState, useEffect } from 'react';
import DesktopIcon from '../DesktopIcon/DesktopIcon';
import Window from '../Window/Window';
import './Desktop.css';

function Desktop({ currentWallpaper, children }) {
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [openWindows, setOpenWindows] = useState([]);

    const initialIcons = [
        {
            id: 'recycle-bin',
            label: 'Recycle Bin',
            iconSrc: '/ModernXP-75-Trash-icon.png'

        },
        {
            id: 'photography-app',
            label: 'Photography',
            iconSrc: '/camera-icon.png'
        },
        {
            id: 'technology-app',
            label: 'Technology',
            iconSrc: '/Device-Manager-Icon.png'
        },
        {
            id: 'pdfview-app',
            label: 'PDFView.exe',
            iconSrc: '/Notepad_WinXP.png'
        }
    ];

    useEffect(() => {
        const handleGlobalClick = () => {
            setSelectedIcon(null);
        };
        window.addEventListener('click', handleGlobalClick);
        return () => {
            window.removeEventListener('click', handleGlobalClick);
        };
    }, []);
    
    const handleIconDoubleClick = (icon) => {
        if (openWindows.some(win => win.id === icon.id)) return;
        
        setOpenWindows([
            ...openWindows,
            {
                id: icon.id,
                title: icon.title,
                content: icon.content,
                defaultX: 100 + (openWindows.length * 25),
                defaultY: 100 + (openWindows.length * 25)
            }
        ]);
    };
    
    const handleCloseWindow = (id) => {
        setOpenWindows(openWindows.filter(win => win.id !== id));
    };

    return (
        <div
            className="desktop-environment"
            style={{backgroundImage: `url(${currentWallpaper})`}}
        >
            <div className="desktop-icons">
                {initialIcons.map((icon) => (
                    <div
                        key={icon.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIcon(icon.id);
                        }}
                        onDoubleClick={(e) => {
                            e.stopPropagation();
                            handleIconDoubleClick(icon);
                        }}
                    >
                        <DesktopIcon
                            id={icon.id}
                            label={icon.label}
                            iconSrc={icon.iconSrc}
                            isSelected={selectedIcon === icon.id}
                            onSelect={setSelectedIcon}
                        />
                    </div>
                ))}
            </div>
            
            {openWindows.map((win) => (
            <Window
                key={win.id}
                title={win.title}
                defaultX={win.defaultX}
                defaultY={win.defaultY}
                onClose={() => handleCloseWindow(win.id)}
                >
                {win.content}
            </Window>
            ))}
            
            {children}
        </div>
    );
}

export default Desktop;