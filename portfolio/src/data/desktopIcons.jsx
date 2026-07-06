import React from 'react';
import PortfolioAppContent from '../apps/PortfolioApp/PortfolioAppContent';

export const initialIcons = [
    {
        id: 'recycle-bin',
        label: 'Recycle Bin',
        iconSrc: '/ModernXP-75-Trash-icon.png'

    },
    {
        id: 'photography-app',
        label: 'Photography',
        iconSrc: '/camera-icon.png'
    },
    {
        id: 'technology-app',
        label: 'Technology',
        iconSrc: '/Device-Manager-Icon.png'
    },
    {
        id: 'pdfview-app',
        label: 'PDFView.exe',
        iconSrc: '/Notepad_WinXP.png'
    },
    {
        id: 'portfolio_app',
        label: 'portfolio_bezilla.exe',
        iconSrc: '/portfolio-app-icon.png',
        content: <PortfolioAppContent />
    }
];