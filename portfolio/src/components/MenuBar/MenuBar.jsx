import React, { useState, useRef, useEffect } from 'react';
import './MenuBar.css';
import '../ContextMenu/ContextMenu.css';

export default function MenuBar({ config }) {
    const [activeMenuIndex, setActiveMenuIndex] = useState(null);
    const [activeSubmenuIndex, setActiveSubmenuIndex] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setActiveMenuIndex(null);
                setActiveSubmenuIndex(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    useEffect(() => {
        setActiveSubmenuIndex(null);
    }, [activeMenuIndex]);

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
        <div className="os-menu-bar" ref={menuRef} onClick={() => {setActiveMenuIndex(null); setActiveSubmenuIndex(null);}} >
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
                            {menu.items.map((item, i) => {
                                if (item.type === 'divider') {
                                    return <div key={i} className="menu-divider" onMouseEnter={() => setActiveSubmenuIndex(null)} />
                                }

                                const hasSubmenu = item.subItems && item.subItems.length > 0;

                                return (
                                    <div
                                        key={i}
                                        className={`menu-option ${item.disabled ? 'disabled' : ''}`}
                                        style={{
                                            position: 'relative',
                                            ...(hasSubmenu ? { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } : {})
                                        }}
                                        onMouseEnter={() => {
                                            if (!item.disabled && hasSubmenu) {
                                                setActiveSubmenuIndex(i);
                                            } else {
                                                setActiveSubmenuIndex(null);
                                            }
                                        }}
                                        onClick={(e) => {
                                            if (item.disabled || hasSubmenu) return;
                                            if (item.onClick) item.onClick();
                                            setActiveMenuIndex(null);
                                            setActiveSubmenuIndex(null);
                                        }}
                                    >
                                        <span>{renderLabel(item.label)}</span>

                                        {hasSubmenu && <div className="submenu-arrow"></div>}

                                        {hasSubmenu && activeSubmenuIndex === i && (
                                            <div
                                                className="menu-dropdown"
                                                style={{
                                                    position: 'absolute',
                                                    left: '100%',
                                                    top: '-3px',
                                                    marginLeft: '-2px'
                                                }}
                                            >
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
                                                                    setActiveMenuIndex(null);
                                                                    setActiveSubmenuIndex(null);
                                                                }
                                                            }}
                                                        >
                                                            {renderLabel(sub.label)}
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}