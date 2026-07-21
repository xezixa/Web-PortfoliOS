import React, { useState } from 'react';
import './DeviceMgr.css';
import { techTree } from '../../data/techData';
import MenuBar from './../../components/menuBar/menuBar';


function DeviceMgr({ onOpenWindow, onCloseWindow}) {
    const [expandedNodes, setExpandedNodes] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    
    const [isRootExpanded, setIsRootExpanded] = useState(true);

    const toggleNode = (categoryId) => {
        setExpandedNodes(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleSelect = (id) => {
        setSelectedId(id);
    };

    const openProperties = (item) => {
        if (onOpenWindow) {
            onOpenWindow({
                id: `prop_${item.id}`,
                title: `${item.name} Properties`,
                iconSrc: item.icon || "/ExplorerIcons/folder_ico.png",
                width: 370,
                height: 470,
                showMinimize: false,
                showMaximize: false,
                showHelp: true,
                content: <TechProperties item={item} onClose={() => onCloseWindow(`prop_${item.id}`)}/>
                
                
            });
        }
    };

    const galleryMenuConfig = [
        {
            label: '&File',
            items: [
                { label: 'Options...', disabled: true},
                { type: 'divider' },
                { label: 'Exit', onClick: () => console.log('Close clicked') }
            ]
        },
        {
            label: '&Action',
            items: [
                {label: 'Help', disabled: true},
            ]
        },
        {
            label: '&View',
            items: [
                { label: 'Devices by type' },
                { label: 'Devices by connection' },
                { label: 'Devices by container' },
                { label: 'Devices by driver' },
                { label: 'Drivers by type' },
                { label: 'Drivers by device' },
                { label: 'Resources by type' },
                { label: 'Resources by connection' },
                { type: 'divider' },
                { label: 'Show hidden devices' },
                { type: 'divider' },
                { label: 'Customize...' },
            ]
        },
        {
            label: '&Help',
            items: [
                { label: 'Help Topics' },
                { label: 'TechCenter Web Site' },
                { type: 'divider' },
                { label: 'About Experience' },
                { label: 'About Device Manager' },
            ]
        },
    ];

    return (
        <div className="devicemgr-container">
            <MenuBar config={galleryMenuConfig} />


            <div className="devicemgr-toolbar">
                <button className="toolbar-icon-btn"><img src="/DevmgmtIcons/dev-left.svg" alt="Back"/></button>
                <button className="toolbar-icon-btn"><img src="/DevmgmtIcons/dev-right.svg" alt="Forward"/></button>
                <div className="toolbar-divider"></div>
                <button className="toolbar-icon-btn" onClick={() => {
                    techTree.forEach(cat => {
                        const found = cat.items.find(i => i.id === selectedId);
                        if (found) openProperties(found);
                    });
                }}>
                    <img src="/DevmgmtIcons/Propt.svg" alt="Properties"/>
                </button>
            </div>

            <div className="devicemgr-tree-area" onClick={() => setSelectedId(null)}>
                <div className="tree-root">
                    <ul className="tree-list">
                        <li className="tree-category-node">
                            <div className="tree-row" onClick={() => setIsRootExpanded(!isRootExpanded)}>
                                <div className="tree-toggle-box">
                                    {isRootExpanded ? '-' : '+'}
                                </div>
                                <img src="/Device-Manager-Icon.png" alt="Computer" className="tree-icon"/>
                                <span className="tree-label bold">TECHNOLOGY</span>
                            </div>

                            {isRootExpanded && (
                                <ul className="tree-sub-list">
                                    {techTree.map((category) => {
                                        const isExpanded = expandedNodes.includes(category.id);

                                        return (
                                            <li key={category.id} className="tree-category-node">
                                                <div
                                                    className="tree-row"
                                                    onClick={() => toggleNode(category.id)}
                                                >
                                                    <div className="tree-toggle-box">
                                                        {isExpanded ? '-' : '+'}
                                                    </div>
                                                    <img src={category.icon || "/ExplorerIcons/default_category.png"} alt="Cat"
                                                         className="tree-icon"/>
                                                    <span className="tree-label">{category.category}</span>
                                                </div>

                                                {isExpanded && (
                                                    <ul className="tree-sub-list">
                                                        {category.items.map((item) => (
                                                            <li key={item.id}>
                                                                <div
                                                                    className={`tree-row leaf-row ${selectedId === item.id ? 'selected' : ''}`}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleSelect(item.id);
                                                                    }}
                                                                    onDoubleClick={(e) => {
                                                                        e.stopPropagation();
                                                                        openProperties(item);
                                                                    }}
                                                                >
                                                                    <img src={item.icon || "/ExplorerIcons/file_ico.png"} alt="Item"
                                                                         className="tree-icon"/>
                                                                    <span className="tree-label">{item.name}</span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

function TechProperties({ item, onClose }) {
    const [activeTab, setActiveTab] = useState('General');

    return (
        <div className="xp-properties-container">
            <div className="xp-tabs-row">
                <div
                    className={`xp-tab ${activeTab === 'General' ? 'active' : ''}`}
                    onClick={() => setActiveTab('General')}
                >
                    General
                </div>
                <div
                    className={`xp-tab ${activeTab === 'Driver' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Driver')}
                >
                    Details
                </div>
            </div>

            <div className="xp-tab-body">
                {activeTab === 'General' && (
                    <>
                        <div className="prop-top-section">
                            <img src={item.icon || "/ExplorerIcons/file_ico.png"} alt="" className="prop-main-icon" />
                            <span className="prop-name">{item.name}</span>
                        </div>
                        <hr className="xp-divider" />

                        <div className="prop-info-grid">
                            <span className="prop-label">Device type:</span>
                            <span>{item.type || 'Standard Device'}</span>
                            <span className="prop-label">Manufacturer:</span>
                            <span>{item.manufacturer || 'Unknown'}</span>
                            <span className="prop-label">Location:</span>
                            <span>{item.location || 'Location 0'}</span>
                        </div>
                        <hr className="xp-divider" />

                        <div className="device-status-box">
                            <div className="status-label">Device status</div>
                            <div className="status-textarea">
                                This device is working properly.
                                <br /><br />
                                If you are having problems with this device, click Troubleshoot to start the troubleshooter.
                            </div>
                            <div className="device-troubleshoot-area">
                                <button className="xp-button">Troubleshoot...</button>
                            </div>
                        </div>

                        <div className="device-usage-section">
                            <span className="prop-label">Device usage:</span>
                            <select className="xp-select">
                                <option>Use this device (enable)</option>
                                <option>Do not use this device (disable)</option>
                            </select>
                        </div>
                    </>
                )}

                {activeTab === 'Driver' && (
                    <div>
                        <p style={{marginTop: 0}}>No additional details are available for this device.</p>
                    </div>
                )}
            </div>

            <div className="xp-properties-footer">
                <button className="xp-button" onClick={onClose}>OK</button>
                <button className="xp-button" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default DeviceMgr;