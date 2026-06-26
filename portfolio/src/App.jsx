import React, { useState } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';

function App() {
    
    const [wallpaper, setWallpaper] = useState('/blissminimal.png');
    
    return (
        <div className="os-root" style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Desktop currentWallpaper={wallpaper}/>
            
            <Taskbar />
            
        </div>
    );
}

export default App;