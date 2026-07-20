import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './GalleryExplorer.css';
import { photoAlbums } from '../../data/photoData';
import PhotoViewer from '../PhotoViewer/PhotoViewer';
import RoverAssistant from '../GalleryExplorer/Rover/RoverAssistant';

function GalleryExplorer({ onOpenWindow, onSetWallpaper }) {
    const [history, setHistory] = useState([null]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [collapsed, setCollapsed] = useState({tasks: false, cameras: true, lenses: true, software: true});
    const [selectedId, setSelectedId] = useState(null);

    const [isSearching, setIsSearching] = useState(false);
    const [roverState, setRoverState] = useState('look');
    
    const currentAlbumId = history[currentIndex];
    const currentAlbum = photoAlbums.find(a => a.id === currentAlbumId);

    const basePath = `C:\\Documents and Settings\\CB\\Documents\\My Pictures`;
    const currentPath = currentAlbumId ? `${basePath}\\${currentAlbum.title}` : basePath;
    
    const handleBack = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    const handleForward = () => {
        if (currentIndex < history.length - 1) setCurrentIndex(currentIndex + 1);
    };

    const handleNavigate = (id) => {
        const newHistory = history.slice(0, currentIndex + 1);
        newHistory.push(id);
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);

    };

    const handleFolderUp = () => {
        if (currentAlbumId) {
            handleNavigate(null);
        }
    }

    const openPhotoViewer = (photo) => {
        onOpenWindow({
            id: 'photo_viewer',
            title: 'Photo and Fax Viewer',
            iconSrc: '/photoview.png',
            width: 900,
            height: 700,
            content: (
                <PhotoViewer
                    photo={photo}
                    onSetBackground={onSetWallpaper}
                />
            )
        })
    }
    
    const toggleSearch = () => {
        setIsSearching(!isSearching);
        if (!isSearching) {
            setRoverState('look');
        }
    };
    
    const handleDoSearch = () => {
        setRoverState('read');
        
        setTimeout(() => {
            setRoverState('hyped');
            
            setTimeout(() => {
                setRoverState('blink');
            }, 5000);
        }, 3000);
    };

    return (
        <div className="explorer-container">
            <div className="explorer-menu-bar">
                <span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span>F<u>a</u>vorites</span><span><u>T</u>ools</span><span><u>H</u>elp</span>
            </div>

            <div className="explorer-toolbar">
                <div className="toolbar-section">
                    <button className={`toolbar-btn ${currentIndex === 0 ? 'disabled' : ''}`} onClick={handleBack}>
                        <img src="/ExplorerIcons/Back.png" alt="Back" className="nav-icon-img" />
                        <span>Back</span>
                        <div className="css-dropdown-arrow"></div>
                    </button>

                    <button className={`toolbar-btn ${currentIndex === history.length - 1 ? 'disabled' : ''}`}
                            onClick={handleForward}>
                        <img src="/ExplorerIcons/Forward.png" alt="Forward" className="nav-icon-img" />
                        <div className="css-dropdown-arrow"></div>
                    </button>
                    <button
                        className={`toolbar-btn ${!currentAlbumId ? 'disabled' : ''}`}
                        onClick={currentAlbumId ? handleFolderUp : undefined}
                    >
                        <img
                            src="/ExplorerIcons/direc_ico.png"
                            alt="Up"
                            style={{width: 30, height: 30, opacity: !currentAlbumId ? 0.5 : 1}}
                        />
                    </button>
                </div>
                <div className="toolbar-divider"></div>

                <button
                    className="toolbar-btn"
                    onClick={toggleSearch}
                    style={isSearching ? { backgroundColor: '#c1d2ee', border: '1px solid #316ac5' } : {}}
                >
                    <img src="/ExplorerIcons/search_ico.png" alt="Search"/>
                    <span>Search</span>
                </button>

                <button className="toolbar-btn">
                    <img src="/ExplorerIcons/doublefolder.png" alt="Folders"/>
                    <span>Folders</span>
                </button>
                <div className="toolbar-divider"></div>
                <button className="toolbar-btn" style={{padding: '4px 4px'}}>
                    <img src="/ExplorerIcons/idk_ico.png" alt="Views" style={{width: 28, height: 28}}/>
                    <div className="css-dropdown-arrow"></div>
                </button>
            </div>

            <div className="explorer-address-bar">
                <span className="address-label">Address</span>
                <div className="address-input-wrapper">
                    <img src="/ExplorerIcons/explorer_ico.png" alt="" className="address-icon"/>
                    <input type="text" value={currentPath} readOnly className="address-input"/>
                    <div className="address-dropdown-btn">
                        <div className="address-dropdown-arrow"></div>
                    </div>

                </div>
                <button className="address-go-btn">
                    <img src="/ExplorerIcons/Go.png" alt="Go" className="go-icon-img" />
                </button>
                <span>Go</span>
            </div>

            <div className="explorer-body">

                {isSearching ? (
                    <div className="search-companion-pane">
                        <div className="search-criteria-box">
                            <p className="search-title">Search by any or all of the criteria below.</p>

                            <label className="search-label">All or part of the file name:</label>
                            <input type="text" className="search-input" />

                            <label className="search-label">A word or phrase in the file:</label>
                            <input type="text" className="search-input" />

                            <label className="search-label">Look in:</label>
                            <select className="search-dropdown">
                                <option>My Pictures</option>
                                <option>Local Hard Drives (C:)</option>
                                <option>My Documents</option>
                            </select>

                            <div className="search-action-buttons">
                                <button className="search-btn" onClick={toggleSearch}>Cancel</button>
                                <button className="search-btn" onClick={handleDoSearch}>Search</button>
                            </div>
                        </div>

                        <div className="rover-container">
                            <RoverAssistant currentState={roverState} />
                        </div>
                    </div>
                ) : (
                    <div className="explorer-sidebar">
                        {[
                            {
                                id: 'tasks',
                                title: 'Picture Tasks',
                                content: [
                                    {name: 'Order prints online', url: 'https://google.com'},
                                    {name: 'View slideshow'},
                                ]
                            },
                            {
                                id: 'cameras',
                                title: 'Cameras Used',
                                content: [
                                    {name: 'Canon G1 X Mark III', url: 'https://www.usa.canon.com/support/p/powershot-g1-x-mark-iii'},
                                    {name: 'Canon EOS Rebel T5i', url: 'https://www.canon.ca/en/product?name=EOS_Rebel_T5i&category=/en/products/Cameras/DSLR-Cameras/Entry-level'},
                                    {name: 'DJI Osmo Action 4', url: 'https://www.dji.com/osmo-action-4'},
                                    {name: 'Pentax K1000', url: 'https://google.com/'},
                                    {name: 'Minolta SRT 101', url: 'https://google.com/'},
                                ]
                            },
                            {id: 'lenses', title: 'Lenses and Gear', content: ['Canon EF 50mm f/1.8 STM', 'Canon EF-S 24mm f/2.8 STM', 'Minolta Rokkor 50mm f/1.4 PG','Minolta Rokkor 135mm f/2.8 PF']},
                            {id: 'software', title: 'Editing Tools', content: ['Adobe Lightroom', 'Adobe Photoshop', 'Audacity']}
                        ].map(group => (
                            <div className="sidebar-group" key={group.id}>
                                <div className="sidebar-header"
                                     onClick={() => setCollapsed(p => ({...p, [group.id]: !p[group.id]}))}>
                                    <span>{group.title}</span>
                                    <div className={`gallery-collapse-btn ${collapsed[group.id] ? 'collapsed' : ''}`}>
                                    </div>
                                </div>
                                {!collapsed[group.id] && (
                                    <div className="sidebar-content">
                                        <ul>{group.content.map((item, i) => (
                                            <li key={i}>
                                                {typeof item === 'object' ? (
                                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="sidebar-link">
                                                        {item.name}
                                                    </a>
                                                ) : (
                                                    item
                                                )}
                                            </li>
                                        ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="explorer-grid" onClick={() => setSelectedId(null)}>
                    {!currentAlbumId ? (
                        photoAlbums.map(album => (
                            <div key={album.id}
                                 className={`explorer-item ${selectedId === album.id ? 'selected' : ''}`}
                                 onClick={(e) => {
                                     e.stopPropagation();
                                     setSelectedId(album.id);
                                 }}
                                 onDoubleClick={() => handleNavigate(album.id)}
                            >
                                <div className="custom-folder-container">
                                    <div className="fd-selection-overlay"></div>
                                    <img src="/ExplorerIcons/folder_ico.png" alt="folder" className="base-folder-img"/>
                                    <div className="folder-photos-grid">
                                        {album.photos.slice(0, 4).map((p, i) => (
                                            <div key={i} className="folder-preview-img"
                                                 style={{backgroundImage: `url(${p.thumb})`}}></div>
                                        ))}
                                    </div>
                                </div>
                                <span className="item-label">{album.title}</span>
                            </div>
                        ))
                    ) : (
                        currentAlbum.photos.map(photo => (
                            <div key={photo.id}
                                 className={`explorer-item photo-item ${selectedId === photo.id ? 'selected' : ''}`}
                                 onClick={(e) => {
                                     e.stopPropagation();
                                     setSelectedId(photo.id);
                                 }}
                                 onDoubleClick={() => openPhotoViewer(photo)}
                            >
                                <div className="photo-thumbnail"><img src={photo.thumb} alt="thumbnail"/></div>
                                <span className="item-label">{photo.id}.jpg</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

GalleryExplorer.propTypes = {
    onOpenWindow: PropTypes.func,
    onSetWallpaper: PropTypes.func
};

export default GalleryExplorer;