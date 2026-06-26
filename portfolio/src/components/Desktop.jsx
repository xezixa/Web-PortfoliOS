import { useState } from 'react';
import DesktopIcon from './DesktopIcon';

function Desktop() {
    const [selectedIcon, setSelectedIcon] = useState(null);
    
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
    
    const handleBackgroundClick = (e) => {
        
        if (e.target === e.currentTarget) {
            setSelectedIcon(null);
        }
    };
        
    return (
        <div className="desktop-environment" onClick={handleBackgroundClick}>
            <div className="desktop-icons" onClick={handleBackgroundClick}>
                {initialIcons.map((icon) => (
                    <DesktopIcon
                    key={icon.id}
                    id={icon.id}
                    label={icon.label}
                    iconSrc={icon.iconSrc}
                    isSelected={selectedIcon === icon.id}
                    onSelect={setSelectedIcon}
                    />
                ))}
            </div>
        </div>
    );
}

export default Desktop;