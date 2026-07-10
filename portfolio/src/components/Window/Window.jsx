import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import './Window.css';

function Window({
                    window, title, iconSrc, isActive, onOpenWindow, children, onClose, onFocus,
                    width = 600, height = 400, defaultX = 100, defaultY = 100,
                    onMinimize, isMinimized, animationState, style,
                    // These props control visibility
                    showMinimize = true,
                    showMaximize = true,
                    showHelp = false,
                    onHelp
                }) {
    
    const finalWidth = window.width || width;
    const finalHeight = window.height || height;
    
    const showMin = showMinimize ?? true;
    const showMax = showMaximize ?? true;
    const showHlp = showHelp ?? false;
    
    const nodeRef = useRef(null);

    const animationClass = animationState === 'minimizing'
        ? 'minimizing'
        : animationState === 'restoring'
            ? 'restoring'
            : '';

    const windowClasses = `app-window ${animationClass} ${isActive ? 'active' : ''}`;
    
    const isFullyMinimized = isMinimized && !animationState;

    return (
        <Draggable
            nodeRef={nodeRef}
            handle=".window-header"
            bounds="parent"
            defaultPosition={{ x: defaultX, y: defaultY }}
            onMouseDown={() => { if (!isFullyMinimized) onFocus(window.id); }}
        >
            <div
                ref={nodeRef}
                style={{
                    ...style,
                    top: 0,
                    left: 0,
                    width: `${finalWidth}px`,
                    height: `${finalHeight}px`,
                    zIndex: window.zIndex,
                    position: 'absolute',
                    pointerEvents: isFullyMinimized ? 'none' : 'auto',
                    opacity: isFullyMinimized ? 0 : 1
                }}
            >
                <div className={windowClasses} data-app={window.id}>
                    <div className="window-header">
                        <span className="window-title">
                            {/* Icon Logic: If iconSrc exists, show it */}
                            {iconSrc && <img src={iconSrc} alt="" className="window-icon" />}
                            {title}
                        </span>

                        <div className="window-controls">
                            {/* Conditional Rendering */}
                            {showMin && (
                                <button className="window-btn minimize-btn"
                                        aria-label="Minimize"
                                        onClick={(e) => { e.stopPropagation(); onMinimize(window.id); }}
                                ></button>
                            )}
                            {showMax && (
                                <button className="window-btn maximize-btn" aria-label="Maximize"></button>
                            )}
                            {showHlp && (
                                <button className="window-btn help-btn" onClick={onHelp} aria-label="Help">?</button>
                            )}
                            <button className="window-btn close-btn" onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }} aria-label="Close"></button>
                        </div>
                    </div>

                    <div className="window-body">
                        {React.Children.map(children, child =>
                            React.isValidElement(child)
                                ? React.cloneElement(child, { onOpenWindow, onClose })
                                : child
                        )}
                    </div>
                </div>
            </div>
        </Draggable>
    );
}

export default Window;