import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import './Window.css';

function Window({
                    window, title, iconSrc, onOpenWindow, children, onClose, onFocus,
                    width = 600, height = 400, defaultX = 100, defaultY = 100,
                    onMinimize, isMinimized, animationState, style
                }) {
    const nodeRef = useRef(null);

    const animationClass = animationState === 'minimizing'
        ? 'minimizing'
        : animationState === 'restoring'
            ? 'restoring'
            : '';

    // Fully minimized state ensures the outer shell hides correctly AFTER animation
    const isFullyMinimized = isMinimized && !animationState;

    return (
        <Draggable
            nodeRef={nodeRef}
            handle=".window-header"
            bounds="parent"
            defaultPosition={{ x: defaultX, y: defaultY }}
            onMouseDown={() => {
                if (!isFullyMinimized) onFocus(window.id);
            }}
        >
            {/* 1. OUTER SHELL: React-Draggable uses this box. NEVER add CSS scaling here! */}
            <div
                ref={nodeRef}
                style={{
                    ...style,
                    top: 0,
                    left: 0,
                    width: `${width}px`,
                    height: `${height}px`,
                    zIndex: window.zIndex,
                    position: 'absolute',
                    // Shuts off the invisible shield so you can click the desktop icons below
                    pointerEvents: isFullyMinimized ? 'none' : 'auto',
                    opacity: isFullyMinimized ? 0 : 1
                }}
                onMouseDownCapture={() => {
                    if (!isFullyMinimized) onFocus(window.id);
                }}
            >
                {/* 2. INNER SHELL: This performs the visual shrink/grow math */}
                <div
                    className={`app-window ${animationClass}`}
                    data-app={window.id}
                    style={{
                        width: '100%',
                        height: '100%',
                        pointerEvents: isFullyMinimized ? 'none' : 'auto'
                    }}
                >
                    <div className="window-header">
                        <span className="window-title">
                           {iconSrc && <img src={iconSrc} alt="" className="window-icon" />}
                            {title}
                        </span>

                        <div className="window-controls">
                            <button className="window-btn minimize-btn"
                                    aria-label="Minimize"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onMinimize(window.id);
                                    }}
                            ></button>
                            <button className="window-btn maximize-btn" aria-label="Maximize"></button>
                            <button className="window-btn close-btn" onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }} aria-label="Close"></button>
                        </div>
                        
                    </div>

                    <div className="window-body">
                        {React.Children.map(children, child => 
                            React.isValidElement(child) 
                            ? React.cloneElement(child, { onOpenWindow }) 
                            : child
                        )}
                    </div>
                </div>
            </div>
        </Draggable>
    );
}

export default Window;