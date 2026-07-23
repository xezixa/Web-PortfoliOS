import React, { useState } from 'react';
import './ContextMenu.css';
import '../MenuBar/MenuBar.css'; 

export default function ContextMenu({ x, y, items, visible, onClose }) {
   
    const [activeSubmenu, setActiveSubmenu] = useState(null);
   
    if (!visible) return null;

    return (
        <div
            className="context-menu"
            style={{ top: y, left: x }}
            onContextMenu={(e) => e.preventDefault()}
        >
            {items.map((item, index) => {
               if (item.type === 'divider') {
                   return <div key={index} className="menu-divider" onMouseEnter={() => setActiveSubmenu(null)} />
        } 
               const hasSubmenu = item.subItems && item.subItems.length > 0;
                     
               return (
                    <div
                        key={index}
                        className={`menu-option ${item.disabled ? 'disabled' : ''}`}
                        style={{ fontWeight: item.bold ? 'bold' : 'normal' }}
                        onMouseEnter={() => {
                            if (!item.disabled && hasSubmenu) {
                                setActiveSubmenu(index);
                            } else {
                                setActiveSubmenu(null);
                            }
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (item.disabled) return;
                            
                            if (hasSubmenu) return;
                            
                            if (item.onClick) item.onClick();
                            onClose(); 
                        
                        }}
                    >
                        <span>{item.label}</span>

                        {hasSubmenu && <div className="submenu-arrow"></div>}

                        {hasSubmenu && activeSubmenu === index && (
                            <div className="context-menu context-submenu">
                                {item.subItems.map((sub, subIdx) => (
                                    sub.type === 'divider' ? (
                                        <div key={subIdx} className="menu-divider" />
                                    ) : (
                                        <div
                                            key={subIdx}
                                            className={`menu-option ${sub.disabled ? 'disabled' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (!sub.disabled) {
                                                    if (sub.onClick) sub.onClick();
                                                    onClose();
                                                }
                                            }}
                                        >
                                            <span>{sub.label}</span>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
               );
            })}
        </div>
    );
}