import React, { useState } from 'react';
import './DeviceMgr.css';
import { techTree } from '../../data/techData';

function DeviceMgr() {
    const [expandedNodes, setExpandedNodes] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [propertiesModal, setPropertiesModal] = useState(null);

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
        setPropertiesModal(item);
    };

    const closeProperties = () => {
        setPropertiesModal(null);
    };

    return (
        <div className="devicemgr-container">
            <div className="devicemgr-menu-bar">
                <span><u>F</u>ile</span><span><u>A</u>ction</span><span><u>V</u>iew</span><span><u>H</u>elp</span>
            </div>

            <div className="devicemgr-toolbar">
                <button className="toolbar-icon-btn"><img src="/ExplorerIcons/back_ico.png" alt="Back" /></button>
                <button className="toolbar-icon-btn"><img src="/ExplorerIcons/forward_ico.png" alt="Forward" /></button>
                <div className="toolbar-divider"></div>
                <button className="toolbar-icon-btn" onClick={() => {
                    techTree.forEach(cat => {
                        const found = cat.items.find(i => i.id === selectedId);
                        if (found) openProperties(found);
                    });
                }}>
                    <img src="/properties_ico.png" alt="Properties" />
                </button>
            </div>

            <div className="devicemgr-tree-area">
                <div className="tree-root">
                    <div className="tree-row">
                        <img src="/Device-Manager-Icon.png" alt="Computer" className="tree-icon" />
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
                                        <img src={category.icon || "/ExplorerIcons/default_category.png"} alt="Cat" className="tree-icon" />
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
                                                        <img src={item.icon || "/ExplorerIcons/file_ico.png"} alt="Item" className="tree-icon" />
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

            {propertiesModal && (
                <div className="properties-modal-overlay">
                    <div className="properties-window">
                        <div className="properties-header">
                            <span>{propertiesModal.name} Properties</span>
                            <button className="properties-close-btn" onClick={closeProperties}>X</button>
                        </div>

                        <div className="properties-tabs">
                            <div className="tab active">General</div>
                            <div className="tab">Experience</div>
                            <div className="tab">Details</div>
                        </div>

                        <div className="properties-body">
                            <div className="prop-top-section">
                                <img src={propertiesModal.icon} alt="Icon" className="prop-main-icon" />
                                <div className="prop-title-block">
                                    <div className="prop-name">{propertiesModal.name}</div>
                                </div>
                            </div>

                            <div className="prop-divider"></div>

                            <div className="prop-info-grid">
                                <span>Provider:</span> <span>{propertiesModal.provider}</span>
                                <span>Time Used:</span> <span>{propertiesModal.experience}</span>
                                <span>Location:</span> <span>0 (Primary Stack)</span>
                            </div>

                            <div className="prop-divider"></div>

                            <div className="device-status-box">
                                <div className="status-label">Device status</div>
                                <div className="status-textarea">
                                    {propertiesModal.status}
                                    <br /><br />
                                    {propertiesModal.usage}
                                </div>
                            </div>

                            <div className="device-troubleshoot-area">
                                <button className="xp-button">Troubleshoot...</button>
                            </div>
                        </div>

                        <div className="properties-footer">
                            <button className="xp-button" onClick={closeProperties}>OK</button>
                            <button className="xp-button" onClick={closeProperties}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DeviceMgr;