import React, { useState, useEffect, useRef } from 'react';
import DesktopIcon from '../DesktopIcon/DesktopIcon';
import Window from '../Window/Window';
import { initialIcons } from '../../data/desktopIcons';
import './Desktop.css';
import PortfolioAppContent from "../../apps/PortfolioApp/PortfolioAppContent.jsx";
import GalleryExplorer from "../../apps/GalleryExplorer/GalleryExplorer.jsx";
import ResumeView from "../../apps/PortfolioApp/ResumeView.jsx";
import DeviceMgr from "../../apps/DeviceMgr/DeviceMgr.jsx";

function Desktop({
                     currentWallpaper, 
                     setWallpaper,
                     minimizedWindows,
                     openWindows,
                     animatingWindows,
                     onMinimize,
                     onFocus,
                     onOpenWindow,
                     onCloseWindow,
                     focusedWindowId,
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
                offsetY: mouseY - (targetIcon ? targetIcon.y : 0),
                originalX: targetIcon ? targetIcon.x : 0,
                originalY: targetIcon ? targetIcon.y : 0
            };
        });
        setDraggedIcon(dragGroup);
    };

    const draggedIconRef = useRef(draggedIcon);
    useEffect(() => {
        draggedIconRef.current = draggedIcon;
    }, [draggedIcon]);

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

            setIcons(prevIcons => {
                const draggedIntentions = draggedIcon.map(dragData => {
                    const currentIcon = prevIcons.find(i => i.id === dragData.id);
                    const snappedX = Math.round((currentIcon.x - PADDING) / GRID_SIZE_X) * GRID_SIZE_X + PADDING;
                    const snappedY = Math.round((currentIcon.y - PADDING) / GRID_SIZE_Y) * GRID_SIZE_Y + PADDING;

                        return {
                            id: dragData.id,
                            intendedX: Math.max(PADDING, snappedX),
                            intendedY: Math.max(PADDING, snappedY),
                            originalX: dragData.originalX,
                            originalY: dragData.originalY
                        };
                    });
                    return prevIcons.map(icon => {
                        const intention = draggedIntentions.find(intent => intent.id === icon.id);
                        
                        if (intention) {
                            const isOccupied = prevIcons.some(otherIcon => {
                                const isNotBeingDragged = !draggedIntentions.some(intent => intent.id === otherIcon.id);
                                return isNotBeingDragged &&
                                    otherIcon.x === intention.intendedX &&
                                    otherIcon.y === intention.intendedY;
                            });
                            
                            if (isOccupied) {
                                return {...icon, x: intention.originalX, y: intention.originalY};
                            } else {
                                return { ...icon, x: intention.intendedX, y: intention.intendedY };
                            }
                        }
                        return icon;
                    });
                });
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

                if (!win || !win.id) return null;

                const isPortfolio = win.id === 'portfolio_app';

                const winWidth = win.width;
                const winHeight = win.height;

                const isMinimized = minimizedWindows.includes(win.id);
                const animationState = animatingWindows?.[win.id] || '';

                return (
                    <Window
                        key={win.id}
                        style={{ zIndex: win.zIndex}}
                        window={win}
                        title={win.title}
                        iconSrc={win.iconSrc || icons.find(i => i.id === win.id)?.iconSrc}
                        defaultX={win.defaultX}
                        defaultY={win.defaultY}
                        width={winWidth}
                        height={winHeight}
                        onClose={() => onCloseWindow(win.id)}
                        isActive={win.id === focusedWindowId}
                        onFocus={() => {
                            onFocus(win.id);
                        }}
                        isFocused={focusedWindowId === win.id}
                        onMinimize={() => onMinimize(win.id)}
                        isMinimized={isMinimized}
                        animationState={animationState}

                        showMinimize={win.showMinimize ?? true}
                        showMaximize={win.showMaximize ?? true}
                        showHelp={win.showHelp ?? false}
                        onHelp={win.onHelp}

                        onOpenWindow={(config) => {
                            onOpenWindow(config);
                        }}
                    >
                        {win.id === 'portfolio_app' ? (
                            <PortfolioAppContent onOpenWindow={(config) => {
                                onOpenWindow(config);
                            }} />
                        ) : win.id === 'resume-app' ? (
                            <ResumeView onClose={() => onCloseWindow(win.id)} />
                        ) : win.id === 'gallery_app' ? (
                            <GalleryExplorer
                                onOpenWindow={onOpenWindow}
                                onSetWallpaper={setWallpaper}
                             />
                        ) : win.id === 'technology_app' ? (
                            <DeviceMgr
                            onOpenWindow={onOpenWindow}
                            onCloseWindow={onCloseWindow}
                            />
                        ) : (
                            win.content
                        )}

                    </Window>
                );
            })}

            {children}
        </div>
    );
}

export default Desktop;