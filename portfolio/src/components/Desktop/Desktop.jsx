import { useState, useEffect, useRef } from 'react';
import DesktopIcon from '../DesktopIcon/DesktopIcon';
import Window from '../Window/Window';
import { initialIcons } from '../../data/desktopIcons';
import './Desktop.css';

function Desktop({
                     currentWallpaper,
                     minimizedWindows,
                     openWindows, 
                     animatingWindows,
                     onMinimize,
                     onFocus,
                     onOpenWindow,
                     onCloseWindow,
                     children
                 }) {

    const [icons, setIcons] = useState(() =>
        initialIcons.map((icon, index) => {
            if (icon.id === 'portfolio_app') {
                return {
                    ...icon,
                    x: 10 + (8 * 84),
                    y: 10 + (4 * 84)
                };
            }
            return {
                ...icon,
                x: 10,
                y: 10 + (index * 84)
            };
        })
    );

    const [selectedIconIds, setSelectedIconIds] = useState([]);
    const [selection, setSelection] = useState({
        isSelecting: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0
    });

    const [draggedIcon, setDraggedIcon] = useState(null);
    const desktopRef = useRef(null);
    const iconsContainerRef = useRef(null);
    const justFinishedSelecting = useRef(false);

    const handleDragStart = (ids, clientX, clientY) => {
        const iconsToDrag = Array.isArray(ids) ? ids : [ids];
        const rect = desktopRef.current.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        const dragGroup = iconsToDrag.map(iconId => {
            const targetIcon = icons.find(icon => icon.id === iconId);
            return {
                id: iconId,
                offsetX: mouseX - (targetIcon ? targetIcon.x : 0),
                offsetY: mouseY - (targetIcon ? targetIcon.y : 0)
            };
        });
        setDraggedIcon(dragGroup);
    };

    const draggedIconRef = useRef(draggedIcon);
    useEffect(() => {
        draggedIconRef.current = draggedIcon;
    }, [draggedIcon]);

    useEffect(() => {
        const handleGlobalClick = (e) => {
            if (e.target.closest('.desktop-icon')) return;

            if (justFinishedSelecting.current) {
                justFinishedSelecting.current = false;
                return;
            }

            if (draggedIconRef.current) return;

            setSelectedIconIds([]);
        };

        window.addEventListener('click', handleGlobalClick, true);

        return () => {
            window.removeEventListener('click', handleGlobalClick, true);
        };
    }, []);

    const handleMouseDown = (e) => {

        if (draggedIcon) return;

        const isClickingBackground = e.target === desktopRef.current || e.target.classList.contains('desktop-icons');
        if (!isClickingBackground) return;

        e.preventDefault();

        const rect = desktopRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setSelection({
            isSelecting: true,
            startX: x,
            startY: y,
            currentX: x,
            currentY: y
        });

        setSelectedIconIds([]);
    };

    const handleMouseMove = (e) => {
        if (draggedIcon && draggedIcon.length > 0) {
            const rect = desktopRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setIcons(prevIcons =>
                prevIcons.map(icon => {
                    const dragData = draggedIcon.find(d => d.id === icon.id);
                    if (dragData) {
                        return {
                            ...icon,
                            x: x - dragData.offsetX,
                            y: y - dragData.offsetY,
                        };
                    }
                    return icon;
                })
            );
            return;
        }

        if (!selection.isSelecting) return;

        const rect = desktopRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setSelection(prev => ({
            ...prev,
            currentX: x,
            currentY: y
        }));

        if (iconsContainerRef.current) {
            const startX = selection.startX + rect.left;
            const startY = selection.startY + rect.top;
            const currentX = e.clientX;
            const currentY = e.clientY;

            const boxLeft = Math.min(startX, currentX);
            const boxTop = Math.min(startY, currentY);
            const boxRight = Math.max(startX, currentX);
            const boxBottom = Math.max(startY, currentY);

            const newlySelected = [];

            const iconElements = iconsContainerRef.current.children;
            for (let i = 0; i < iconElements.length; i++) {
                const iconEl = iconElements[i];
                const iconRect = iconEl.getBoundingClientRect();
                const iconId = iconEl.getAttribute('data-id');

                const isOverlapping = !(
                    iconRect.right < boxLeft ||
                    iconRect.left > boxRight ||
                    iconRect.bottom < boxTop ||
                    iconRect.top > boxBottom
                );

                if (isOverlapping && iconId) {
                    newlySelected.push(iconId);
                }
            }
            setSelectedIconIds(newlySelected);
        }
    };

    const handleMouseUp = () => {
        if (draggedIcon) {
            const GRID_SIZE_X = 84;
            const GRID_SIZE_Y = 84;
            const PADDING = 10;

            setIcons(prevIcons =>
                prevIcons.map(icon => {
                    const wasDragged = draggedIcon.some(d => d.id === icon.id);
                    if (wasDragged) {
                        const snappedX = Math.round((icon.x - PADDING) / GRID_SIZE_X) * GRID_SIZE_X + PADDING;
                        const snappedY = Math.round((icon.y - PADDING) / GRID_SIZE_Y) * GRID_SIZE_Y + PADDING;

                        return {
                            ...icon,
                            x: Math.max(PADDING, snappedX),
                            y: Math.max(PADDING, snappedY)
                        };
                    }
                    return icon;
                })
            );
            justFinishedSelecting.current = true;

            setDraggedIcon(null);
            return;
        }

        if (!selection.isSelecting) return;

        const width = Math.abs(selection.startX - selection.currentX);
        const height = Math.abs(selection.startY - selection.currentY);
        if (width > 5 || height > 5) {
            justFinishedSelecting.current = true;
        }

        setSelection(prev => ({...prev, isSelecting: false}));
    };

    const getSelectionStyle = () => {
        const {startX, startY, currentX, currentY} = selection;

        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);
        const width = Math.abs(startX - currentX);
        const height = Math.abs(startY - currentY);

        return {
            left: `${left}px`,
            top: `${top}px`,
            width: `${width}px`,
            height: `${height}px`,
            display: selection.isSelecting ? 'block' : 'none'
        };
    };

    const handleIconDoubleClick = (icon) => {
        onOpenWindow(icon);
    };

    return (
        <div
            ref={desktopRef}
            className="desktop-environment"
            style={{backgroundImage: `url(${currentWallpaper})`}}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className="desktop-selection-box" style={getSelectionStyle()} />

            <div className="desktop-icons" ref={iconsContainerRef}>
                {icons.map((icon) => (
                    <DesktopIcon
                        key={icon.id}
                        id={icon.id}
                        label={icon.label}
                        iconSrc={icon.iconSrc}
                        x={icon.x}
                        y={icon.y}
                        isSelected={selectedIconIds.includes(icon.id)}
                        onSelect={(id) => {
                            if (!selectedIconIds.includes(id)) {
                                setSelectedIconIds([id]);
                            }
                        }}
                        onOpen={() => handleIconDoubleClick(icon)}
                        onDragStart={(id, clientX, clientY) => {
                            const iconsToDrag = selectedIconIds.includes(id) ? selectedIconIds : [id];
                            handleDragStart(iconsToDrag, clientX, clientY);
                        }}
                    />
                ))}
            </div>

            {openWindows.map((win) => {
                // 1. Safety Guard
                if (!win || !win.id) return null;

                const isPortfolio = win.id === 'portfolio_app';
                const winWidth = isPortfolio ? 900 : 600;
                const winHeight = isPortfolio ? 500 : 400;

                // 2. Safe State Evaluation
                const isMinimized = minimizedWindows.includes(win.id);
                // OPTIONAL CHAINING FIX: Prevents the "Cannot read properties of undefined" crash
                const animationState = animatingWindows?.[win.id] || '';

                return (
                    <Window
                        key={win.id}
                        window={win}
                        title={win.title}
                        iconSrc={icons.find(i => i.id === win.id)?.iconSrc}
                        defaultX={win.defaultX}
                        defaultY={win.defaultY}
                        width={winWidth}
                        height={winHeight}
                        onClose={() => onCloseWindow(win.id)}
                        onFocus={() => onFocus(win.id)}
                        onMinimize={() => onMinimize(win.id)}
                        // Pass explicit states to Window.jsx
                        isMinimized={isMinimized}
                        animationState={animationState}
                    >
                        {win.content}
                    </Window>
                );
            })}

            {children}
        </div>
    );
}

export default Desktop;