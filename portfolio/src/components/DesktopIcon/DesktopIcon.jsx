import React from 'react';
import './DesktopIcon.css';

function DesktopIcon({ id, label, iconSrc, x, y, isSelected, onSelect, onOpen, onDragStart }) {

    const handleClick = (e) => {
        e.stopPropagation();
        // We removed onSelect(id) from here because it is now handled the instant you click down!
    };

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        if (onOpen) onOpen();
    };

    const handleMouseDown = (e) => {
        // CRITICAL: This stops the click from passing through to the Desktop background
        e.stopPropagation();

        // e.button === 0 ensures this ONLY triggers on a Left Click
        if (e.button === 0) {
            // 1. Instantly select the icon the millisecond the mouse button is pressed
            onSelect(id);

            // 2. Begin the drag logic immediately
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