import React from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';

function App() {
    return (
        <div className="os-root" style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Desktop />
            <Taskbar />
        </div>
    );
}

export default App;