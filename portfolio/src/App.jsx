import {useState, useEffect} from 'react';
function App() {
    
    const [selectedIcon, setSelectedIcon] = useState(null);
    
    useEffect(() => {
        const handleDesktopClick = (e) => {
            if (e.target.classList.contains('desktop-environment')) {
                setSelectedIcon(null);
            }
        };

        window.addEventListener('click', handleDesktopClick);
        return () => window.removeEventListener('click', handleDesktopClick);
    }, []);
        
  return (
      <div className="desktop-environment">
        {/*Desktop Icon Grid*/}
          <div className="desktop-icons">

              {/*Recycle Bin Shortcut*/}
              <div
                  className={`desktop-shortcut ${selectedIcon === 'recycle-bin' ? 'app-selected' : ''}`}
                  onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIcon('recycle-bin');
                  }}
                  >
                  
                  <div className="shortcut-icon-wrapper">
                     
                      <img
                          src="/ModernXP-75-Trash-icon.png"
                          alt="Recycle Bin"
                          className="shortcut-icon-img"
                          />
                  </div>
                  <span className="shortcut-label">Recycle Bin</span>
              </div>
          </div>
      </div>
      
  );
}

export default App;