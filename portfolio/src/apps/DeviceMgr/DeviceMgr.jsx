import React, { useState } from 'react';
import './DeviceMgr.css';
import { techTree } from '../../data/techData';

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
                    {/* Wrap everything in a main list so the root gets lines and boxes */}
                    <ul className="tree-list">
                        <li className="tree-category-node">
                            <div className="tree-row" onClick={() => setIsRootExpanded(!isRootExpanded)}>
                                <div className="tree-toggle-box">
                                    {isRootExpanded ? '-' : '+'}
                                </div>
                                <img src="/Device-Manager-Icon.png" alt="Computer" className="tree-icon"/>
                                <span className="tree-label bold">TECHNOLOGY</span>
                            </div>

                            {/* Render children only if root is expanded */}
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

export default DeviceMgr;