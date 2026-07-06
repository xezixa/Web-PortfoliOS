import React, { useState } from 'react';
import Desktop from './components/Desktop/Desktop';
import Taskbar from './components/Taskbar/Taskbar';
import { initialIcons } from './data/desktopIcons';

function App() {
    const [minimizedWindows, setMinimizedWindows] = useState([]);
    const [activeZIndex, setActiveZIndex] = useState(100);
    const [wallpaper, setWallpaper] = useState('/blissminimal.png');

    const [focusedWindowId, setFocusedWindowId] = useState('portfolio_app');

    const [openWindows, setOpenWindows] = useState(() => {
        const winWidth = 900;
        const winHeight = 500;
        const centerX = (window.innerWidth / 2) - (winWidth / 2);
        const centerY = (window.innerHeight / 2) - (winHeight / 2);

        return [{
            id: 'portfolio_app',
            title: 'portfolio_bezilla.exe',
            content: initialIcons.find(icon => icon.id === 'portfolio_app')?.content,
            iconSrc: initialIcons.find(icon => icon.id === 'portfolio_app')?.iconSrc,
            defaultX: centerX,
            defaultY: centerY,
            zIndex: 100
        }];
    });

    const handleMinimizeWindow = (id) => setMinimizedWindows((prev) => [...prev, id]);

    const handleRestoreWindow = (id) => {
        setMinimizedWindows((prev) => prev.filter(wId => wId !== id));
        handleFocusWindow(id); 
    };

    const handleFocusWindow = (id) => {
        setFocusedWindowId(id);
        const newZ = activeZIndex + 1;
        setActiveZIndex(newZ);
        setOpenWindows((prev) =>
            prev.map((win) => (win.id === id ? {...win, zIndex: newZ} : win))
        );
    };

    const handleOpenWindow = (icon) => {
        if (openWindows.some(win => win.id === icon.id)) {
            if (minimizedWindows.includes(icon.id)) {
                handleRestoreWindow(icon.id);
            } else {
                handleFocusWindow(icon.id);
            }
            return;
        }

        const isPortfolio = icon.id === 'portfolio_app';
        const winWidth = isPortfolio ? 900 : 600;
        const winHeight = isPortfolio ? 500 : 400;
        const centerX = (window.innerWidth / 2) - (winWidth / 2);
        const centerY = (window.innerHeight / 2) - (winHeight / 2);

        const nextZ = activeZIndex + 1;
        setActiveZIndex(nextZ);
        setFocusedWindowId(icon.id);

        setOpenWindows((prev) => [
            ...prev,
            {
                id: icon.id,
                title: icon.title || icon.label,
                content: icon.content,
                iconSrc: icon.iconSrc,
                defaultX: centerX,
                defaultY: centerY,
                zIndex: nextZ
            }
        ]);
    };

    return (
        <div className="os-root" style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Desktop
                currentWallpaper={wallpaper}
                minimizedWindows={minimizedWindows}
                openWindows={openWindows}
                setOpenWindows={setOpenWindows}
                onMinimize={handleMinimizeWindow}
                onRestore={handleRestoreWindow}
                onFocus={handleFocusWindow}
                onOpenWindow={handleOpenWindow} 
            />
            <Taskbar
                minimizedWindows={minimizedWindows}
                onRestore={handleRestoreWindow}
                openWindows={openWindows}
                onFocus={handleFocusWindow}
                focusedWindowId={focusedWindowId} 
            />
        </div>
    );
}

export default App;