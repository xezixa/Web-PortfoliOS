import React from 'react';
import './DesktopIcon.css';

function DesktopIcon({ id, label, iconSrc, x, y, isSelected, onSelect, onOpen, onDragStart, isShortcut }) {

    const handleClick = (e) => {
        e.stopPropagation();
    };

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        if (onOpen) onOpen();
    };

    const handleMouseDown = (e) => {
        e.stopPropagation();

        if (e.button === 0) {
            onSelect(id);

            if (onDragStart) {
                onDragStart(id, e.clientX, e.clientY);
            }
        }
    };

    return (
        <div
            className={`desktop-shortcut ${isSelected ? 'app-selected' : ''}`}
            data-id={id}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onMouseDown={handleMouseDown}
            style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`
            }}
        >
            <div 
                className="shortcut-icon-wrapper"
                style={{ '--icon-url': `url(${iconSrc})` }}
                >
                <img
                    src={iconSrc}
                    alt={label}
                    className="shortcut-icon-img"
                    draggable="false"/>

                {isShortcut && (
                    <div className="shortcut-overlay-container">
                    <img
                        src="/Shortcut%20overlay.png"
                        alt="shortcut"
                        className="shortcut-overlay-img"
                        draggable="false"
                        />
                    </div>
                )}
            </div>
            <span className="shortcut-label">{label}</span>
        </div>
    );
}

export default DesktopIcon;