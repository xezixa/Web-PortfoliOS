import React, { useState } from 'react';
import Desktop from './components/Desktop/Desktop';
import Taskbar from './components/Taskbar/Taskbar';
import StartMenu from './components/StartMenu/StartMenu';
import './components/animations.css';
import { initialIcons } from './data/desktopIcons';
import PhotoViewer from './apps/PhotoViewer/PhotoViewer';

function App() {
    const [minimizedWindows, setMinimizedWindows] = useState([]);
    const [activeZIndex, setActiveZIndex] = useState(100);
    const [wallpaper, setWallpaper] = useState('/blissminimal.png');
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
    const [focusedWindowId, setFocusedWindowId] = useState('portfolio_app');

    const [animatingWindows, setAnimatingWindows] = useState({});
    
    const handleOpenPhotoViewer = (photo) => {
        onOpenWindow({
            id: 'photo_viewer',
            title: 'Picture and Fax Viewer',
            iconSrc: '/camera-icon.png',
            width: 800,
            height: 600,
            content: (
                <PhotoViewer
                    photo={photo}
                    onSetBackground={setWallpaper}
                />
            )
        });
    }
    
    const getEffectiveId = (rawId) => {
        if (!rawId) return null;
        if (rawId === 'pdfview.exe') return 'resume-app';
        if (rawId === 'Photography' || rawId === 'photography' || rawId === 'gallery') return 'gallery_app';
        return rawId;
    };

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
            width: 900,
            height: 500,
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
        const updatedMinimized = minimizedWindows.filter(wId => wId !== id);

        setOpenWindows(updatedWindows);
        setMinimizedWindows(updatedMinimized);

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

    const handleRestoreWindow = (rawId) => {
        
        const id = getEffectiveId(rawId);
        
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

        setMinimizedWindows(prev => prev.filter(wId => wId !== id));
        setAnimatingWindows(prev => ({ ...prev, [id]: 'restoring' }));
        handleFocusWindow(id);

        setTimeout(() => {
            setAnimatingWindows(prev => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
        }, 300);
    };

    const handleFocusWindow = (id) => {
        const nextZ = activeZIndex + 1;
        setActiveZIndex(nextZ); 

        setFocusedWindowId(id);
        setOpenWindows((prev) =>
            prev.map((win) => {
                if (win.id === id) {
                    return { ...win, zIndex: nextZ };
                }
                return win;
            })
        );
    };

    const handleOpenWindow = (icon) => {
        
        const isDesktopResume = icon.label === 'pdfview.exe' || icon.id === 'resume-app';
        const isGallery = icon.label === 'Photography' || icon.id === 'gallery_app';
        
        let effectiveId = icon.id;
        if (isDesktopResume) effectiveId = 'resume-app' ;
        if (isGallery) effectiveId = 'gallery_app';
        
        if (openWindows.some(win => win.id === effectiveId)) {
            if (minimizedWindows.includes(effectiveId)) {
                handleRestoreWindow(effectiveId);
            } else {
                handleFocusWindow(effectiveId);
            }
            return;
        }
        
        const isPortfolio = icon.id === 'portfolio_app';
        
        let winWidth = icon.width || 600;
        let winHeight = icon.height || 400;
        
        if (isPortfolio) {
            winWidth = 900;
            winHeight = 500;
        } else if (isDesktopResume) {
            winWidth = 590;
            winHeight = 720;
        } else if (isGallery) {
            winWidth = 850;
            winHeight = 620;
        }
        
        
        const taskbarHeight = 40;
        const availableHeight = window.innerHeight - taskbarHeight;
        
        const centerX = (window.innerWidth / 2) - (winWidth / 2);
        let centerY = (window.innerHeight / 2) - (winHeight / 2);

        if (icon.id === 'resume-app') {
            centerY = centerY -25;
        }

        if (centerY < 10) centerY = 10;
        if (centerX < 10) centerX = 10;

        const finalX = isPortfolio ? centerX : (icon.defaultX !== undefined ? icon.defaultX : centerX);
        const finalY = isPortfolio ? centerY : (icon.defaultY !== undefined ? icon.defaultY : centerY);
        
        setFocusedWindowId(effectiveId);

        const nextZ = activeZIndex + 1;
        setActiveZIndex(nextZ);

        setOpenWindows((prev) => {
            if (prev.some(win => win.id === effectiveId)) {
                return prev;
            }

            return [
                ...prev,
                {
                    ...icon,
                    id: effectiveId,
                    title: isDesktopResume ? 'resume_chase_bezilla.pdf' : isGallery ? 'My Pictures' : (icon.title || icon.label),
                    content: icon.content,
                    iconSrc: isGallery ? '/ExplorerIcons/explorer_ico.png' : icon.iconSrc,
                    width: winWidth,
                    height: winHeight,
                    defaultX: finalX,
                    defaultY: finalY,
                    zIndex: nextZ
                }
            ];
        });
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
                setWallpaper={setWallpaper}
                minimizedWindows={minimizedWindows}
                openWindows={openWindows}
                animatingWindows={animatingWindows}
                focusedWindowId={focusedWindowId}
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