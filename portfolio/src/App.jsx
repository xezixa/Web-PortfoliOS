import React, { useState } from 'react';
import Desktop from './components/Desktop/Desktop';
import Taskbar from './components/Taskbar/Taskbar';
import StartMenu from './components/StartMenu/StartMenu';
import './components/animations.css';
import { initialIcons } from './data/desktopIcons';

function App() {
    const [minimizedWindows, setMinimizedWindows] = useState([]);
    const [activeZIndex, setActiveZIndex] = useState(100);
    const [wallpaper, setWallpaper] = useState('/blissminimal.png');
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
    const [focusedWindowId, setFocusedWindowId] = useState('portfolio_app');

    const [animatingWindows, setAnimatingWindows] = useState({});
    
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

    const handleMinimizeWindow = (id) => {
        
        setOpenWindows(prev => prev.map(win =>
        win.id === id ? { ...win, zIndex: 9999 } : win
        ));
        
        const windowEl = document.querySelector(`.app-window[data-app="${id}"]`);
        const taskbarBtn = document.querySelector(`.taskbar-task-btn[data-app="${id}"]`);

        if (windowEl && taskbarBtn) {
            const winRect = windowEl.getBoundingClientRect();
            const btnRect = taskbarBtn.getBoundingClientRect();

            const deltaX = (btnRect.left + btnRect.width / 2) - (winRect.left + winRect.width / 2);
            const deltaY = (btnRect.top + btnRect.height / 2) - (winRect.top + winRect.height / 2);

            windowEl.style.setProperty('--target-x', `${deltaX}px`);
            windowEl.style.setProperty('--target-y', `${deltaY}px`);
        }

        setAnimatingWindows(prev => ({...prev, [id]: 'minimizing'}));

        if (focusedWindowId === id) {
            const visibleWindows = openWindows.filter(
                (win) => win.id !== id && !minimizedWindows.includes(win.id)
            );
            if (visibleWindows.length > 0) {
                const nextFocused = visibleWindows.reduce((prev, current) =>
                    (prev.zIndex > current.zIndex) ? prev : current
                );
                handleFocusWindow(nextFocused.id);
            } else {
                setFocusedWindowId(null);
            }
        }

        // 4. Complete minimization accurately matched to your 0.3s CSS
        setTimeout(() => {
            setMinimizedWindows((prev) => {
                if (!prev.includes(id)) return [...prev, id];
                return prev;
            });
            setAnimatingWindows(prev => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
        }, 300);
    };

    const handleCloseWindow = (id) => {
        const updatedWindows = openWindows.filter(win => win.id !== id);
        setOpenWindows(updatedWindows);
        
        setMinimizedWindows((prev) => prev.filter(wId => wId !== id));
        
        if (focusedWindowId === id) {
            const visibleWindows = updatedWindows.filter(
                (win) => !minimizedWindows.includes(win.id)
            );
            
            if (visibleWindows.length > 0) {
                const nextFocused = visibleWindows.reduce((prev, current) =>
                (prev.zIndex > current.zIndex) ? prev : current
                );
                handleFocusWindow(nextFocused.id);
            } else {
                setFocusedWindowId(null);
            }
        }
    };

    const handleRestoreWindow = (id) => {
        
        setOpenWindows(prev => prev.map(win =>
        win.id === id ? { ...win, zIndex: 1000 } : win
        ));
        
        const windowEl = document.querySelector(`.app-window[data-app="${id}"]`);
        const taskbarBtn = document.querySelector(`.taskbar-task-btn[data-app="${id}"]`);

        if (windowEl && taskbarBtn) {
            const winRect = windowEl.getBoundingClientRect();
            const btnRect = taskbarBtn.getBoundingClientRect();

            const deltaX = (btnRect.left + btnRect.width / 2) - (winRect.left + winRect.width / 2);
            const deltaY = (btnRect.top + btnRect.height / 2) - (winRect.top + winRect.height / 2);

            windowEl.style.setProperty('--target-x', `${deltaX}px`);
            windowEl.style.setProperty('--target-y', `${deltaY}px`);
        }

        // 2. Trigger restore state instantly
        setMinimizedWindows(prev => prev.filter(wId => wId !== id));
        setAnimatingWindows(prev => ({ ...prev, [id]: 'restoring' }));
        handleFocusWindow(id);

        // 3. Clear animation state
        setTimeout(() => {
            setAnimatingWindows(prev => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
        }, 300);
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
        <div className="os-root" style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden' }}
        onClick={(e) => {
            
            if (e.target.className === 'os-root' && isStartMenuOpen) {
                setIsStartMenuOpen(false);
            }
        }}
        >
            <Desktop
                currentWallpaper={wallpaper}
                minimizedWindows={minimizedWindows}
                openWindows={openWindows}
                animatingWindows={animatingWindows}
                setOpenWindows={setOpenWindows}
                onMinimize={handleMinimizeWindow}
                onRestore={handleRestoreWindow}
                onFocus={handleFocusWindow}
                onOpenWindow={handleOpenWindow}
                onCloseWindow={handleCloseWindow}
            />
            <Taskbar
                minimizedWindows={minimizedWindows}
                onRestore={handleRestoreWindow}
                onMinimize={handleMinimizeWindow}
                openWindows={openWindows}
                onFocus={handleFocusWindow}
                focusedWindowId={focusedWindowId} 
                onToggleStartMenu={() => {setIsStartMenuOpen(!isStartMenuOpen);
                }}
            />
            <div onClick={(e) => e.stopPropagation()}>
                <StartMenu 
                    isOpen={isStartMenuOpen} 
                    onClose={() => setIsStartMenuOpen(false)}
                />
            </div>
        </div>
    );
}

export default App;