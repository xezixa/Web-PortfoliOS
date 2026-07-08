import React, { useState } from 'react';
import './ContactForm.css';

function ContactForm({ onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        topic: 'photography',
        subject: '',
        message: ''
    });

    return (
        <div className="contact-form-container">

            {/* The Grid structure ensures labels align perfectly */}
            <div className="form-grid">

                {/* Topic Field */}
                <div className="win-btn-label">Select a Topic...</div>
                <select
                    className="win-input"
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                >
                    <option value="photography">Photography Inquiry</option>
                </select>

                {/* Name Field */}
                <div className="win-btn-label">Your Name</div>
                <input
                    type="text"
                    className="win-input"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />

                {/* Subject Field */}
                <div className="win-btn-label">Subject:</div>
                <input
                    type="text"
                    className="win-input"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
            </div>

            {/* Large Text Area */}
            <textarea
                className="win-textarea-large"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
            />

            {/* Footer */}
            <div className="contact-footer-panel">
                <button type="button" className="win-btn" onClick={onClose}>Cancel</button>
                <button type="button" className="win-btn">Send</button>
            </div>
        </div>
    );
}

export default ContactForm;