import React, { createContext, useState, useContext, useEffect } from 'react';
import ContextMenu from '.././ContextMenu/ContextMenu'; 

const ContextMenuContext = createContext();

export function ContextMenuProvider({ children }) {
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        items: []
    });

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (contextMenu.visible && !e.target.closest('.context-menu')) {
                setContextMenu(prev => ({ ...prev, visible: false }));
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [contextMenu.visible]);

    const showContextMenu = (e, items) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            items
        });
    };

    const closeMenu = () => setContextMenu(prev => ({ ...prev, visible: false }));

    return (
        <ContextMenuContext.Provider value={{ showContextMenu }}>
            {children}

            <ContextMenu
                visible={contextMenu.visible}
                x={contextMenu.x}
                y={contextMenu.y}
                items={contextMenu.items}
                onClose={closeMenu}
            />
        </ContextMenuContext.Provider>
    );
}

export const useContextMenu = () => useContext(ContextMenuContext);