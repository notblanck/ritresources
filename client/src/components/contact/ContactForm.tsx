import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext.js';
import { sendContactMessage } from '../../services/api.js';

export const ContactForm: React.FC = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    try {
      await sendContactMessage({ name, email, message });
      showToast('Message sent — thanks for reaching out!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      showToast(err.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrap" id="view-contact">
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h2>Get in <span>Touch</span></h2>
        <p>Questions, feedback, or want to help build ritresources? Reach out.</p>
      </div>
      <div className="contact-card">
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@ritchennai.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Message</label>
            <textarea
              placeholder="How can we help?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={submitting}
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};
