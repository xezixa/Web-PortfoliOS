import React from 'react';
import './DesktopIcon.css';

function DesktopIcon({ id, label, iconSrc, isSelected, onSelect, onOpen }) {

    const handleClick = (e) => {
        e.stopPropagation();
        onSelect(id);
    };
    
    const handleDoubleClick = (e) => {
        e.stopPropagation();
        if (onOpen) onOpen();
    };

    return (
        <div
            className={`desktop-shortcut ${isSelected ? 'app-selected' : ''}`}
            data-id={id}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            <div className="shortcut-icon-wrapper">
                <img
                    src={iconSrc}
                    alt={label}
                    className="shortcut-icon-img"
                    draggable="false" 
                />
            </div>
            <span className="shortcut-label">{label}</span>
        </div>
    );
}

export default DesktopIcon;