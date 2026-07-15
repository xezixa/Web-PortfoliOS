import React, { useState } from 'react';
import './DeviceMgr.css';
import { techTree } from '../../data/techData';

function DeviceMgr({ onOpenWindow, onCloseWindow}) {
    const [expandedNodes, setExpandedNodes] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

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

    return (
        <div className="devicemgr-container">
            <div className="devicemgr-menu-bar">
                <span><u>F</u>ile</span><span><u>A</u>ction</span><span><u>V</u>iew</span><span><u>H</u>elp</span>
            </div>

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

            <div className="devicemgr-tree-area">
                <div className="tree-root">
                    <div className="tree-row">
                        <img src="/Device-Manager-Icon.png" alt="Computer" className="tree-icon"/>
                        <span className="tree-label bold">TECHNOLOGY</span>
                    </div>

                    <ul className="tree-list">
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
                </div>
            </div>
        </div>
    );
}
            export function TechProperties({ item, onClose }) {
            const [activeTab, setActiveTab] = useState('General');

            return (
            <div className="xp-properties-container">
            <div className="xp-tabs-row">
                <div className={`xp-tab ${activeTab === 'General' ? 'active' : ''}`} onClick={() => setActiveTab('General')}>General</div>
                <div className={`xp-tab ${activeTab === 'Experience' ? 'active' : ''}`} onClick={() => setActiveTab('Experience')}>Experience</div>
                <div className={`xp-tab ${activeTab === 'Driver' ? 'active' : ''}`} onClick={() => setActiveTab('Driver')}>Details</div>
            </div>

            <div className="xp-tab-body">
                {activeTab === 'General' && (
                    <>
                        <div className="prop-top-section">
                            <img src={item.icon || "/ExplorerIcons/file_ico.png"} alt="Icon" className="prop-main-icon" />
                            <div className="prop-title-block">
                                <div className="prop-name">{item.name}</div>
                            </div>
                        </div>

                        <hr className="xp-divider" />

                        <div className="prop-info-grid">
                            <span className="prop-label">Device type:</span> <span>{item.category || 'Technology'}</span>
                            <span className="prop-label">Manufacturer:</span> <span>{item.provider || 'Standard Provider'}</span>
                            <span className="prop-label">Location:</span> <span>0 (Primary Stack)</span>
                        </div>

                        <hr className="xp-divider" />

                        <fieldset className="xp-fieldset">
                            <legend className="xp-legend">Device status</legend>
                            <div className="status-textarea">
                                {item.status || 'This device is working properly.'}
                                <br /><br />
                                {item.usage || 'No usage conflicts detected.'}
                            </div>
                            <div className="device-troubleshoot-area">
                                <button className="xp-button">Troubleshoot...</button>
                            </div>
                        </fieldset>

                        <div className="device-usage-section">
                            <span className="prop-label">Device usage:</span>
                            <select className="xp-select">
                                <option>Use this device (enable)</option>
                                <option>Do not use this device (disable)</option>
                            </select>
                        </div>
                    </>
                )}

                {activeTab !== 'General' && (
                    <div style={{ padding: '20px' }}>Additional data for {activeTab} goes here.</div>
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