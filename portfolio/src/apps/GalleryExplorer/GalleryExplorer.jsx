import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './GalleryExplorer.css';
import { photoAlbums } from '../../data/photoData';
import PhotoViewer from '../PhotoViewer/PhotoViewer';

function GalleryExplorer({ onOpenWindow, onSetWallpaper }) {
    const [history, setHistory] = useState([null]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [collapsed, setCollapsed] = useState({tasks: false, cameras: false, lenses: false, software: false});
    const [selectedId, setSelectedId] = useState(null);

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
            iconSrc: '/camera-icon.png',
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
    
    return (
        <div className="explorer-container">
            <div className="explorer-menu-bar">
                <span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span>F<u>a</u>vorites</span><span><u>T</u>ools</span><span><u>H</u>elp</span>
            </div>

            <div className="explorer-toolbar">
                <div className="toolbar-section">
                    <button className={`toolbar-btn ${currentIndex === 0 ? 'disabled' : ''}`} onClick={handleBack}>
                        <div className="css-nav-circle back">
                            <div className="nav-arrow-head left"></div>
                            <div className="nav-arrow-tail"></div>
                        </div>
                        <span>Back</span>
                        <div className="css-dropdown-arrow"></div>
                    </button>

                    <button className={`toolbar-btn ${currentIndex === history.length - 1 ? 'disabled' : ''}`}
                            onClick={handleForward}>
                        <div className="css-nav-circle forward">
                            <div className="nav-arrow-tail"></div>
                            <div className="nav-arrow-head right"></div>
                        </div>
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
                <button className="toolbar-btn">
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
                    {/* The green native box */}
                    <div className="green-go-box">
                        <div className="go-arrow-container">
                            <div className="go-arrow-body"></div>
                            <div className="go-arrow-head"></div>
                        </div>
                    </div>
                    <span>Go</span>
                </button>
            </div>

            <div className="explorer-body">
                <div className="explorer-sidebar">
                    {[
                        {id: 'tasks', title: 'Picture Tasks', content: ['Order prints online', 'View slideshow']},
                        {id: 'cameras', title: 'Cameras Used', content: ['Sony A7IV', 'Canon AE-1']},
                        {id: 'lenses', title: 'Lenses and Gear', content: ['Sigma 24-70mm', '50mm Prime']},
                        {id: 'software', title: 'Editing Software', content: ['Lightroom', 'Photoshop']}
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
                                    <ul>{group.content.map((item, i) => <li key={i}>{item}</li>)}</ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="explorer-grid"
                     onClick={() => setSelectedId(null)}
                >
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
                            <div key={photo.id} className="explorer-item photo-item"
                                 onDoubleClick={() => openPhotoViewer(photo)}>
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