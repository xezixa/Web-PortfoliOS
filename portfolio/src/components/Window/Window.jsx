import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import './Window.css';

function Window({ title, children, onClose, width = 600, height = 400, defaultX = 100, defaultY = 100 }) {
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
                style={{ width: `${width}px`, height: `${height}px` }}
                >
                <div className="window-header">
                    <span className="window-title">{title}</span>
                    <div className= "window-controls">
                        <button className="window-btn close-btn" onClick={onClose} aria-label="Close">
                            x
                        </button>
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