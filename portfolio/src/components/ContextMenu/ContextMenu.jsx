import React from 'react';
import './ContextMenu.css';
import '../MenuBar/MenuBar.css'; 

export default function ContextMenu({ x, y, items, visible, onClose }) {
    if (!visible) return null;

    return (
        <div
            className="context-menu"
            style={{ top: y, left: x }}
            onContextMenu={(e) => e.preventDefault()}
        >
            {items.map((item, index) => (
                item.type === 'divider' ? (
                    <div key={index} className="menu-divider" />
                ) : (
                    <div
                        key={index}
                        className={`menu-option ${item.disabled ? 'disabled' : ''}`}
                        style={{ fontWeight: item.bold ? 'bold' : 'normal' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!item.disabled) {
                                if (item.onClick) item.onClick();
                                onClose(); 
                            }
                        }}
                    >
                        {item.label}
                    </div>
                )
            ))}
        </div>
    );
}