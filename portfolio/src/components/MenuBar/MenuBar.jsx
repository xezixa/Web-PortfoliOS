import React, { useState, useRef, useEffect } from 'react';
import './MenuBar.css';

export default function MenuBar({ config }) {
    const [activeMenuIndex, setActiveMenuIndex] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setActiveMenuIndex(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const renderLabel = (text) => {
        if (!text) return null;
        const parts = text.split(/&([a-zA-Z0-9])/);
        if (parts.length === 1) return text; 

        return (
            <>
                {parts[0]}
                <u>{parts[1]}</u>
                {parts[2]}
            </>
        );
    };

    return (
        <div className="os-menu-bar" ref={menuRef} onClick={() => setActiveMenuIndex(null)} >
            {config.map((menu, index) => (
                <div
                    key={menu.label}
                    className="menu-bar-item-container"
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={() => {
                        if (activeMenuIndex !== null) setActiveMenuIndex(index);
                    }}
                >
                    <div
                        className={`menu-bar-label ${activeMenuIndex === index ? 'active' : ''}`}
                        onClick={() => setActiveMenuIndex(activeMenuIndex === index ? null : index)}
                    >
                        {renderLabel(menu.label)}
                    </div>

                    {activeMenuIndex === index && (
                        <div className="menu-dropdown">
                            {menu.items.map((item, i) => (
                                item.type === 'divider' ? (
                                    <div key={i} className="menu-divider" />
                                ) : (
                                    <div
                                        key={i}
                                        className={`menu-option ${item.disabled ? 'disabled' : ''}`}
                                        onClick={() => {
                                            if (item.disabled) return;
                                            if (item.onClick) item.onClick();
                                            setActiveMenuIndex(null);
                                        }}
                                    >
                                        {renderLabel(item.label)}
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}