import React from 'react';

function DesktopIcon({id, label, iconSrc, isSelected, onSelect}) {
    return (
        <div
            className={`desktop-shortcut ${isSelected ? 'app-selected' : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(id);
            }}
        >
            <div className="shortcut-icon-wrapper">
                <img
                    src={iconSrc}
                    alt={label}
                    className="shortcut-icon-img"
                />
            </div>
            <span className="shortcut-label">{label}</span>
        </div>
    );
}

export default DesktopIcon;