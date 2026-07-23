import React from 'react';
import PortfolioAppContent from '../apps/PortfolioApp/PortfolioAppContent';

export const initialIcons = [
    {
        id: 'recycle-bin',
        label: 'Recycle Bin',
        iconSrc: '/recyc-full.png'

    },
    {
        id: 'photography-app',
        label: 'Photography',
        iconSrc: '/photofolder2.png'
    },
    {
        id: 'technology-app',
        label: 'Technology',
        iconSrc: '/Device-Manager-Icon.png'
    },
    {
        id: 'resume-app',
        label: 'PDF Viewer',
        isShortcut: true,
        iconSrc: '/Notepad_WinXP.png'
    },
    {
        id: 'portfolio_app',
        label: 'My Portfolio',
        isShortcut: true,
        iconSrc: '/portfolio-app-icon.png',
        content: <PortfolioAppContent />
    }
];