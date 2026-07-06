import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import './Window.css';

function Window({ window, title, iconSrc, children, onClose, onFocus, width = 600, height = 400, defaultX = 100, defaultY = 100, onMinimize, style }) {
    const nodeRef = useRef(null);
    return (
        <Draggable
            nodeRef={nodeRef}
            handle=".window-header"
            bounds="parent"
            defaultPosition={{ x: defaultX, y: defaultY }}
            >
            <div
                ref={nodeRef}
                className="app-window"
                style={{
                    ...style,
                    top: 0,
                    left: 0,
                    width: `${width}px`,
                    height: `${height}px`, 
                    zIndex: window.zIndex, 
                    position: 'absolute'
            }}
                onMouseDown={() => onFocus(window.id)}
                >
                <div className="window-header">
                    <span className="window-title">
                       {iconSrc && <img src={iconSrc} alt="" className="window-icon" />}
                        {title}
                    </span>
                    
                    <div className= "window-controls">
                        <button className="window-btn minimize-btn"
                                aria-label="Minimize" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onMinimize();
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
                    {children}
                </div>
            </div>
        </Draggable>
    );
}

export default Window;