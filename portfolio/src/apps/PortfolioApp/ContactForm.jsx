import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Draggable from 'react-draggable';
import './ContactForm.css';

function ContactForm({ onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        topic: 'Photography',
        subject: '',
        message: ''
    });
    const [isOpen, setIsOpen] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const dropdownRef = useRef(null);
    const modalRef = useRef(null);

    const options = ['Photography', 'IT/Technology', 'Web Design/Development', 'Other'];

    return (
        <div className="contact-form-container">
            <div className="contact-header"></div>

            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 999,
                        background: 'transparent'
                    }}
                    onClick={() => setIsOpen(false)}
                />
            )}

            {showConfirmation && createPortal (
                <Draggable
                    nodeRef={modalRef} 
                    handle=".conf-drag-handle"
                    
                    defaultPosition={{ x: 0, y: -220 }}
                >
                    <div className="confirmation-modal" ref={modalRef}>

                        <div className="conf-drag-handle">
                            <span className="window-title">Thank You!</span>
                            <div className="window-controls">
                            </div>
                        </div>

                        <div className="conf-body-container">
                            <div className="conf-white-box">
                                <div className="conf-message-primary">Your message has successfully been sent!</div>
                                <div className="conf-message-secondary">I will be with you shortly :)</div>
                            </div>
                           
                            <div className="conf-footer-panel">
                                <button className="win-btn" onClick={onClose}>OK</button>
                            </div>
                        </div>
                        </div>
                </Draggable>,
                document.body
            )}
            <div className="form-grid-wrapper">
                <div className="form-grid">
                    <div className="win-label-plain">Select a Topic...</div>
                    
                    <div className="custom-select-container">
                        <div 
                            className={`dropdown-trigger ${isOpen ? 'active' : ''}`} 
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <div className="dropdown-text">
                                {formData.topic}
                            </div>
                            <div className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
                                ▼
                            </div>
                        </div>
                        
                        {isOpen && (
                            <div className="dropdown-menu">
                                {options.map((option) => (
                                    <div 
                                        key={option} 
                                        className="option-item" 
                                        onClick={() => {
                                            setFormData({...formData, topic: option});
                                            setIsOpen(false);
                                        }}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                <div className="win-label-button">Your Name</div>
                <input
                    type="text"
                    className="win-input"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />

                <div className="win-label-button">Subject:</div>
                <input
                    type="text"
                    className="win-input"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
                </div>
            </div>

            <textarea
                className="win-textarea"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
            />

            <div className="contact-footer">
                <button type="button" className="win-btn" onClick={onClose}>Cancel</button>
                <button type="button" className="win-btn" onClick={() => setShowConfirmation(true)}>Send</button>
            </div>
            </div>
    );
}

export default ContactForm;
