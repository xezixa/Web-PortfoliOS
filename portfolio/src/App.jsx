import React, { useState } from 'react';
import Desktop from './components/Desktop/Desktop';
import Taskbar from './components/Taskbar/Taskbar';
import Window from './components/Window/Window';

function App() {
    
    const [openWindows, setOpenWindows] = useState([]);
    const [wallpaper, setWallpaper] = useState('/blissminimal.png');
    const openWindow = (id) => {
        if (!openWindows.includes(id)) {
            setOpenWindows([...openWindows, id]);
        }
    };
    
    const closeWindow = (id) => {
        setOpenWindows(openWindows.filter(windowId => windowId !== id));
    };
    
    
    return (
        <div className="os-root" style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Desktop currentWallpaper={wallpaper}>
                
            </Desktop>
            <Taskbar />
            
        </div>
    );
}

export default App;