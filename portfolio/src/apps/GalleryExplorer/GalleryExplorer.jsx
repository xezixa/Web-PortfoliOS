import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './GalleryExplorer.css';
import { photoAlbums } from '../../data/photoData';
import PhotoViewer from '../PhotoViewer/PhotoViewer';
import RoverAssistant from '../GalleryExplorer/Rover/RoverAssistant';
import MenuBar from './../../components/MenuBar/MenuBar';

function GalleryExplorer({ onOpenWindow, onSetWallpaper }) {
    const [history, setHistory] = useState([null]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [collapsed, setCollapsed] = useState({tasks: false, cameras: true, lenses: true, software: true});
    const [selectedId, setSelectedId] = useState(null);
    
    const [viewMode, setViewMode] = useState('thumbnails');
    const [isViewsDropdownOpen, setIsViewsDropdownOpen] = useState(false);
    const viewsDropdownRef = useRef(null);
    
    const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);
    const addressBarRef = useRef(null);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addressBarRef.current && !addressBarRef.current.contains(event.target)) {
                setIsAddressDropdownOpen(false);
            }

            if (viewsDropdownRef.current && !viewsDropdownRef.current.contains(event.target)) {
                setIsViewsDropdownOpen(false);
            }
        };
        if (isAddressDropdownOpen || isViewsDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
        
    }, [isAddressDropdownOpen, isViewsDropdownOpen]);

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

    const galleryMenuConfig = [
        {
            label: 'File',
            items: [
                { label: 'Create Shortcut', disabled: true},
                { label: 'Delete', disabled: true},
                { label: 'Rename', disabled: true},
                { label: 'Properties', disabled: true},
                { type: 'divider' },
                { label: 'Close', onClick: () => console.log('Close clicked') }
            ]
        },
        {
            label: 'Edit',
            items: [
                { label: 'Undo', disabled: true},
                { label: 'Redo', disabled: true},
                { type: 'divider' },
                { label: 'Cut', disabled: true},
                { label: 'Copy', disabled: true},
                { label: 'Paste', disabled: true},
                { label: 'Paste Shortcut', disabled: true},
                { type: 'divider' },
                { label: 'Copy To Folder...', disabled: true},
                { label: 'Move To Folder...', disabled: true},
                { type: 'divider' },
                { label: 'Select All', disabled: true},
                { label: 'Invert Selection', disabled: true},

            ]
        },
        {
            label: 'View',
            items: [
                { 
                    label: 'Toolbars',
                    subItems: [
                        { label: 'Standard Buttons' },
                        { label: 'Address Bar' },
                        { label: 'Links' },
                        { type: 'divider' },
                        { label: 'Lock the Toolbars' },
                        { label: 'Customize...', disabled: true },
                    ]
                },
                { label: 'Status Bar', disabled: true },
                { 
                    label: 'Explorer Bar',
                    subItems: [
                        { label: 'Search' },
                        { label: 'Favorites' },
                        { label: 'History' },
                        { label: 'Folders' },
                        { type: 'divider' },
                        { label: 'Tip of the Day' },
                    ]
                },
                { type: 'divider' },
                { label: 'Thumbnails' },
                { label: 'Tiles' },
                { label: 'Icons' },
                { label: 'List' },
                { label: 'Details', disabled: true },
                { type: 'divider' },
                {
                    label: 'Arrange Icons by',
                    subItems: [
                        {label: 'Name', onClick: () => console.log('Sort by Name')},
                        {label: 'Type', onClick: () => console.log('Sort by Type')},
                        {label: 'Total Size', onClick: () => console.log('Sort by Total Size')},
                        {label: 'Free Space', onClick: () => console.log('Sort by Free Space')},
                        {label: 'Comments', onClick: () => console.log('Sort by Comments')},
                        {type: 'divider' },
                        {label: 'Show in Groups', onClick: () => console.log('Show in Groups')},
                        {label: 'Auto Arrange', onClick: () => console.log('Auto Arrange')},
                        {label: 'Align to Grid', onClick: () => console.log('Align to Grid')}
                    ]
                },
                { type: 'divider' },
                { label: 'Choose Details', disabled: true },
                { label: 'Go To...', disabled: true },
                { label: 'Refresh', onClick: () => console.log('Refreshing...') }
            ]
        },
        {
            label: 'Favorites',
            items: [
                { label: 'Add to Favorites...', disabled: true },
                { label: 'Organize Favorites...', disabled: true },

            ]
        },
        {
            label: 'Tools',
            items: [
                { label: 'Map Network Drive...', disabled: true },
                { label: 'Disconnect Network Drive...', disabled: true },
                { label: 'Synchronize', disabled: true },
                { type: 'divider' },
                { label: 'Folder Options...', disabled: true },
            ]
        },
        {
            label: 'Help',
            items: [
                { label: 'Help and Support Center' },
                { type: 'divider' },
                { label: 'Is this copy of PortfoliOS legal?' },
                { label: 'About PortfoliOS' },
            ]
        }
    ];
    
    return (
        <div className="explorer-container">
            <MenuBar config={galleryMenuConfig} />

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
                <div className="explorer-toolbar-divider"></div>

                <button
                    className={`toolbar-btn ${isSearching ? 'selected' : ''}`}
                    onClick={toggleSearch}
                >
                    <img src="/ExplorerIcons/search_ico.png" alt="Search"/>
                    <span>Search</span>
                </button>

                <button className="toolbar-btn">
                    <img src="/ExplorerIcons/doublefolder.png" alt="Folders"/>
                    <span>Folders</span>
                </button>
                <div className="explorer-toolbar-divider"></div>

                <div className="toolbar-btn-wrapper" ref={viewsDropdownRef} style={{ position: 'relative' }}>
                    <button
                        className="toolbar-btn"
                        style={{padding: '4px 4px'}}
                        onClick={() => setIsViewsDropdownOpen(!isViewsDropdownOpen)}
                    >
                        <img src="/ExplorerIcons/idk_ico.png" alt="Views" style={{width: 28, height: 28}}/>
                        <div className="css-dropdown-arrow"></div>
                    </button>

                    {isViewsDropdownOpen && (
                        <div className="views-dropdown">
                            <div className="view-option" onClick={() => {setViewMode('thumbnails'); setIsViewsDropdownOpen(false)}}>
                                <span className="view-check">{viewMode === 'thumbnails' ? '•' : ''}</span> Thumbnails
                            </div>
                            <div className="view-option" onClick={() => {setViewMode('tiles'); setIsViewsDropdownOpen(false)}}>
                                <span className="view-check">{viewMode === 'tiles' ? '•' : ''}</span> Tiles
                            </div>
                            <div className="view-option" onClick={() => {setViewMode('icons'); setIsViewsDropdownOpen(false)}}>
                                <span className="view-check">{viewMode === 'icons' ? '•' : ''}</span> Icons
                            </div>
                            <div className="view-option" onClick={() => {setViewMode('list'); setIsViewsDropdownOpen(false)}}>
                                <span className="view-check">{viewMode === 'list' ? '•' : ''}</span> List
                            </div>
                            <div className="menu-divider" style={{margin: '3px 2px'}}></div>
                            <div className="view-option disabled">
                                <span className="view-check"></span> Details
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="explorer-address-bar">
                <span className="address-label">Address</span>
                <div className="address-input-wrapper" ref={addressBarRef}>
                    <img src="/ExplorerIcons/explorer_ico.png" alt="" className="address-icon"/>
                    <input type="text" value={currentPath} readOnly className="address-input"/>

                    <div
                        className="address-dropdown-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsAddressDropdownOpen(!isAddressDropdownOpen);
                            setIsViewsDropdownOpen(false);
                        }}
                    >
                        <div className="address-dropdown-arrow"></div>
                    </div>

                    {isAddressDropdownOpen && (
                        <div className="address-history-dropdown">
                            <div className="history-item">
                                <img src="/Device-Manager-Icon.png" alt="PC" /> My Computer
                            </div>
                            <div className="history-item indent-1">
                                <img src="/folder.png" alt="Drive" /> Local Disk (C:)
                            </div>
                            <div className="history-item indent-2">
                                <img src="/folder.png" alt="Folder" /> Documents and Settings
                            </div>
                            <div className="history-item indent-3">
                                <img src="/folder.png" alt="Folder" /> CB
                            </div>
                            <div className="history-item indent-4">
                                <img src="/folder.png" alt="Folder" /> My Documents
                            </div>
                            <div
                                className={`history-item indent-5 ${!currentAlbumId ? 'active' : ''}`}
                                onClick={() => {
                                    if (currentAlbumId) handleFolderUp();
                                    setIsAddressDropdownOpen(false);
                                }}
                            >
                                <img src="/folder.png" alt="Folder" /> My Pictures
                            </div>

                            {currentAlbumId && (
                                <div
                                    className="history-item indent-6 active"
                                    onClick={() => setIsAddressDropdownOpen(false)}
                                >
                                    <img src="/folder.png" alt="Folder" /> {currentAlbum.title}
                                </div>
                            )}
                        </div>
                    )}
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

                <div className={`explorer-grid explorer-view-${viewMode}`} onClick={() => setSelectedId(null)}>
                    {!currentAlbumId ? (
                        photoAlbums.map(album => (
                            <div key={album.id}
                                 className={`explorer-item ${selectedId === album.id ? 'selected' : ''}`}
                                 onClick={(e) => {
                                     e.stopPropagation();
                                     setSelectedId(album.id);
                                     setIsViewsDropdownOpen(false);
                                     
                                 }}
                                 onDoubleClick={() => handleNavigate(album.id)}
                            >
                                {viewMode === 'thumbnails' ? (
                                    <div className="custom-folder-container">
                                        <div className="fd-selection-overlay"></div>
                                        <img src="/ExplorerIcons/folder_ico.png" alt="folder" className="base-folder-img"/>
                                        <div className="folder-photos-grid">
                                            {album.photos.slice(0, 4).map((p, i) => (
                                                <div key={i} className="folder-preview-img" style={{backgroundImage: `url(${p.thumb})`}}></div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="view-icon-container">
                                        <img src="/ExplorerIcons/folder_ico.png" alt="folder" className={`view-icon-${viewMode}`} />
                                    </div>
                                )}

                                <div className="item-label-container">
                                    <span className="item-label">{album.title}</span>
                                    {viewMode === 'tiles' && <span className="item-subtext">File Folder</span>}
                                </div>
                            </div>
                        ))
                    ) : (
                        currentAlbum.photos.map(photo => (
                            <div key={photo.id}
                                 className={`explorer-item photo-item ${selectedId === photo.id ? 'selected' : ''}`}
                                 onClick={(e) => {
                                     e.stopPropagation();
                                     setSelectedId(photo.id);
                                     setIsViewsDropdownOpen(false);
                                 }}
                                 onDoubleClick={() => openPhotoViewer(photo)}
                            >
                                {viewMode === 'thumbnails' ? (
                                    <div className="photo-thumbnail"><img src={photo.thumb} alt="thumbnail"/></div>
                                ) : (
                                    <div className="view-icon-container">
                                        <img
                                            src={photo.thumb}
                                            alt="file"
                                            className={`view-icon-${viewMode} mini-photo-border`}
                                        />
                                    </div>
                                )}

                                <div className="item-label-container">
                                    <span className="item-label">{photo.id}.jpg</span>
                                    {viewMode === 'tiles' && <span className="item-subtext">JPEG Image</span>}
                                </div>
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