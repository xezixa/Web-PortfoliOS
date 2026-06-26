import React, { useState, useEffect } from 'react';
import './Taskbar.css'

function Taskbar() {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';

            hours = hours % 12;
            hours = hours ? hours : 12;

            setTime(`${hours}:${minutes} ${ampm}`);
        };

        updateClock();
        const timerId = setInterval(updateClock, 60000);
        return () => clearInterval(timerId);
    }, []);
    return (
        <div className="taskbar">

            <div className="taskbar-start-button" onClick={() => console.log('Start clicked')}>
                <span className="start-button-text">start</span>
            </div>

            <div className="taskbar-tasks-container">
            </div>

            <div className="taskbar-system-tray">
                <span className="system-tray-clock">{time}</span>
            </div>

        </div>
    );
}
    
    export default Taskbar;