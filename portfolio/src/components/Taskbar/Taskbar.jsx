import React, {useState, useEffect, useRef} from 'react';
import './Taskbar.css';
import GalleryExplorer from '../../apps/GalleryExplorer/GalleryExplorer';

function Taskbar({ minimizedWindows, onFocus, openWindows, onRestore, onMinimize, focusedWindowId, onToggleStartMenu, onReorderWindows }) {

    const [time, setTime] = useState('');
    const [hoveredWindowId, setHoveredWindowId] = useState(null);

    const [draggedTaskId, setDraggedTaskId] = useState(null);
    const [dragX, setDragX] = useState(0);
    const dragStartX = useRef(0);
    const originalIndex = useRef(0);
    const itemWidth = useRef(100);
    const dragDelta = useRef(0);
    
    const [isTrayExpanded, setIsTrayExpanded] = useState(true);

    const hoverTimerRef = useRef(null);

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            setTime(`${hours}:${minutes} ${ampm}`);
        };
        updateClock();
        const timerId = setInterval(updateClock, 1000);
        return () => clearInterval(timerId);
    }, []);

    const handleMouseEnter = (id) => {
        hoverTimerRef.current = setTimeout(() => {
            setHoveredWindowId(id);
        }, 600);
    };

    const handleMouseLeave = () => {
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
        }
        setHoveredWindowId(null);
    };

    return (
        <div className="taskbar">
            <div
                className="taskbar-start-button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleStartMenu();
                }}
                role="button"
                tabIndex="0"
            >
                <span className="start-button-text">start</span>
            </div>

            <div className="taskbar-tasks-container">
                {openWindows.map((win, index) => {

                    const isMinimized = minimizedWindows.includes(win.id);
                    const isActive = win.id === focusedWindowId && !isMinimized;

                    const previewWidth = 160
                    const targetWidth = win.width || 800;
                    const targetHeight = win.height || 600;
                    const scaleFactor = previewWidth / targetWidth;
                    const previewHeight = targetHeight * scaleFactor;

                    const isDragged = draggedTaskId === win.id;
                    let translateX = 0;
                    let zIndex = 1;
                    let isSibling = false;

                    if (isDragged) {
                        translateX = dragX;
                        zIndex = 1000;
                    } else if (draggedTaskId) {
                        isSibling = true;
                        const currentShift = Math.round(dragX / itemWidth.current);
                        const targetIndex = originalIndex.current + currentShift;

                        if (originalIndex.current < index && index <= targetIndex) {
                            translateX = -itemWidth.current;
                        } else if (originalIndex.current > index && index >= targetIndex) {
                            translateX = itemWidth.current;
                        }
                    }

                    return (
                        <div
                            key={win.id}
                            style={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                transform: `translateX(${translateX}px)`,
                                zIndex: zIndex,
                                transition: isSibling ? 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
                                pointerEvents: draggedTaskId && !isDragged ? 'none' : 'auto'
                            }}
                            onMouseEnter={() => handleMouseEnter(win.id)}
                            onMouseLeave={handleMouseLeave}
                            onPointerDown={(e) => {
                                if (e.button !== 0) return;
                                setDraggedTaskId(win.id);
                                dragStartX.current = e.clientX;
                                originalIndex.current = index;
                                itemWidth.current = e.currentTarget.offsetWidth + 2;
                                setDragX(0);
                                dragDelta.current = 0; 
                                e.currentTarget.setPointerCapture(e.pointerId);
                            }}
                            onPointerMove={(e) => {
                                if (!isDragged) return;
                                const rawDiffX = e.clientX - dragStartX.current;
                                dragDelta.current = rawDiffX; 

                                const minX = -originalIndex.current * itemWidth.current;
                                const maxX = (openWindows.length - 1 - originalIndex.current) * itemWidth.current;

                                const clampedX = Math.max(minX, Math.min(maxX, rawDiffX));
                                setDragX(clampedX);
                            }}
                            onPointerUp={(e) => {
                                if (!isDragged) return;

                                if (Math.abs(dragX) < 5) {
                                    if (isMinimized) onRestore(win.id);
                                    else if (isActive) onMinimize(win.id);
                                    else onFocus(win.id);
                                }
                                else {
                                    const currentShift = Math.round(dragX / itemWidth.current);
                                    const targetIndex = originalIndex.current + currentShift;

                                    if (targetIndex !== originalIndex.current && targetIndex >= 0 && targetIndex < openWindows.length) {
                                        onReorderWindows(win.id, openWindows[targetIndex].id);
                                    }
                                }

                                setDraggedTaskId(null);
                                setDragX(0);
                                e.currentTarget.releasePointerCapture(e.pointerId);
                            }}
                        >
                            <button
                                className={`taskbar-task-btn ${isActive ? 'active' : ''}`}
                                data-app={win.id}
                            >
                                {win.iconSrc && (
                                    <img src={win.iconSrc} alt="" className="taskbar-task-icon" />
                                )}
                                <span className="taskbar-task-title">{win.title}</span>
                            </button>

                            {hoveredWindowId === win.id && (
                                <div className="window-preview-container">
                                    <div className="window-preview-header">
                                        {win.iconSrc && <img src={win.iconSrc} alt="" style={{ width: '12px', height: '12px', marginRight: '5px' }}/>}
                                        <span>{win.title}</span>
                                    </div>
                                    <div className="window-preview-content-wrapper"
                                         style={{
                                             width: `${previewWidth}px`,
                                             height: `${previewHeight}px`,
                                             position: 'relative',
                                             overflow: 'hidden'
                                         }}
                                    >
                                        <div
                                            className="window-preview-content"
                                            style={{
                                                width: `${targetWidth}px`,
                                                height: `${targetHeight}px`,
                                                transform: `scale(${scaleFactor})`,
                                                transformOrigin: 'top left',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                pointerEvents: 'none'
                                            }}
                                        >
                                            {win.id === 'gallery_app' ? (
                                                <GalleryExplorer onOpenWindow={() => {}} />
                                            ) : (
                                                win.content
                                            )}

                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <button className={`tray-expand-circle
            ${isTrayExpanded ? 'expanded' : ''}`}
                    aria-label="Toggle Tray"
                    onClick={() =>
            setIsTrayExpanded(!isTrayExpanded)}
                    >
                <svg viewBox="0 0 24 24" className="chevron-icon">
                    <path d="M15.41,16.59L10.83,12l4.58-4.59L14,6l-6,6l6,6L15.41,16.59z" fill="currentColor"/>
                </svg>
            </button>

            <div className="taskbar-system-tray">
                <div className={`tray-social-links ${isTrayExpanded ? 'expanded' : 'collapsed'}`}>
                    {/* LinkedIn */}
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="tray-social-icon">
                        <svg viewBox="0 0 24 24">
                            <rect width="24" height="24" rx="6" fill="#ffffff" />
                            <path fill="#0A66C2" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                    </a>
                    {/* GitHub */}
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="tray-social-icon">
                        <svg viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="11.5" fill="#ffffff" />
                            <path fill="#000" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>
                    {/* Instagram */}
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="tray-social-icon">
                        <svg viewBox="0 0 24 24">
                            <defs>
                                <linearGradient id="insta-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" style={{ stopColor: '#feda75' }} />
                                    <stop offset="25%" style={{ stopColor: '#fa7e1e' }} />
                                    <stop offset="50%" style={{ stopColor: '#d62976' }} />
                                    <stop offset="75%" style={{ stopColor: '#962fbf' }} />
                                    <stop offset="100%" style={{ stopColor: '#4f5bd5' }} />
                                </linearGradient>
                            </defs>
                            <rect width="24" height="24" rx="6" fill="url(#insta-gradient)" />
                            <path fill="#ffffff" d="M12,4.622c2.403,0,2.688,0.009,3.637,0.052c0.877,0.04,1.354,0.187,1.671,0.31c0.42,0.163,0.72,0.358,1.035,0.673 c0.315,0.315,0.51,0.615,0.673,1.035c0.123,0.317,0.27,0.794,0.31,1.671c0.043,0.949,0.052,1.234,0.052,3.637 s-0.009,2.688-0.052,3.637c-0.04,0.877-0.187,1.354-0.31,1.671c-0.163,0.42-0.358,0.72-0.673,1.035 c-0.315,0.315-0.615,0.51-1.035,0.673c-0.317,0.123-0.794,0.27-1.671,0.31c-0.949,0.043-1.233,0.052-3.637,0.052 s-2.688-0.009-3.637-0.052c-0.877-0.04-1.354-0.187-1.671-0.31c-0.42-0.163-0.72-0.358-1.035-0.673 c-0.315-0.315-0.51-0.615-0.673-1.035c-0.123-0.317-0.27-0.794-0.31-1.671C4.631,14.688,4.622,14.403,4.622,12 s0.009-2.688,0.052-3.637c0.04-0.877,0.187-1.354,0.31-1.671c0.163-0.42,0.358-0.72,0.673-1.035 c0.315-0.315,0.615-0.51,1.035-0.673c0.317-0.123,0.794-0.27,1.671-0.31C9.312,4.631,9.597,4.622,12,4.622 M12,3 C9.556,3,9.249,3.01,8.289,3.054C7.331,3.098,6.677,3.25,6.105,3.472C5.513,3.702,5.011,4.01,4.511,4.511 c-0.5,0.5-0.808,1.002-1.038,1.594C3.25,6.677,3.098,7.331,3.054,8.289C3.01,9.249,3,9.556,3,12c0,2.444,0.01,2.751,0.054,3.711 c0.044,0.958,0.196,1.612,0.418,2.185c0.23,0.592,0.538,1.094,1.038,1.594c0.5,0.5,1.002,0.808,1.594,1.038 c0.572,0.222,1.227,0.375,2.185,0.418C9.249,20.99,9.556,21,12,21s2.751-0.01,3.711-0.054c0.958-0.044,1.612-0.196,2.185-0.418 c0.592-0.23,1.094-0.538,1.594-1.038c0.5-0.5,0.808-1.002,1.038-1.594c0.222-0.572,0.375-1.227,0.418-2.185 C20.99,14.751,21,14.444,21,12s-0.01-2.751-0.054-3.711c-0.044-0.958-0.196-1.612-0.418-2.185c-0.23-0.592-0.538-1.094-1.038-1.594 c-0.5-0.5-1.002-0.808-1.594-1.038c-0.572-0.222-1.227-0.375-2.185-0.418C14.751,3.01,14.444,3,12,3 L12,3z M12,7.365 c-2.559,0-4.635,2.076-4.635,4.635C7.365,14.559,9.441,16.635,12,16.635c2.559,0,4.635-2.076,4.635-4.635 C16.635,9.441,14.559,7.365,12,7.365z M12,15.013c-1.664,0-3.013-1.349-3.013-3.013c0-1.664,1.349-3.013,3.013-3.013 c1.664,0,3.013,1.349,3.013,3.013C15.013,13.664,13.664,15.013,12,15.013z M16.804,6.116c-0.596,0-1.08,0.484-1.08,1.08 s0.484,1.08,1.08,1.08c0.596,0,1.08-0.484,1.08-1.08S17.401,6.116,16.804,6.116z" />
                        </svg>
                    </a>
                </div>
                <span className="system-tray-clock">{time}</span>
            </div>
        </div>
    );
}

export default Taskbar;