import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { srConfig, email } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledContactSection = styled.section`
  max-width: 720px;
  margin: 0 auto 100px;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
  }

  .overline {
    display: block;
    margin-bottom: 20px;
    text-align: center;
    color: var(--yellow);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: 400;

    &:before {
      bottom: 0;
      font-size: var(--fz-sm);
    }

    &:after {
      display: none;
    }
  }

  .handwritten {
    margin: 0 0 40px;
    color: var(--lightest-slate);
    font-family: var(--font-hand);
    font-size: clamp(34px, 6vw, 56px);
    font-weight: 500;
    line-height: 1.25;
    letter-spacing: 0.01em;
  }

  /* Hand-drawn underline under one word */
  .underlined {
    position: relative;
    white-space: nowrap;

    svg {
      position: absolute;
      left: -2%;
      bottom: -0.12em;
      width: 104%;
      height: 0.32em;
      overflow: visible;
      color: var(--yellow);
    }
  }

  .card {
    padding: 24px;
    border: 1px solid var(--surface-border);
    border-radius: 16px;
    background-color: var(--surface);

    @media (max-width: 480px) {
      padding: 20px;
    }
  }

  .eyebrow {
    margin: 0 0 10px;
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .intro {
    margin: 0 0 22px;
    max-width: 560px;
    color: var(--light-slate);
    font-size: var(--fz-lg);
    line-height: 1.5;
  }

  textarea {
    display: block;
    width: 100%;
    min-height: 110px;
    padding: 14px 16px;
    border: 1px solid var(--input-border);
    border-radius: 12px;
    background-color: var(--input-bg);
    color: var(--lightest-slate);
    font-family: var(--font-sans);
    font-size: var(--fz-lg); /* 16px+ stops iOS from zooming in on focus */
    line-height: 1.5;
    resize: vertical;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &::placeholder {
      color: var(--slate);
      opacity: 0.8;
    }

    &:focus {
      outline: none;
      border-color: var(--yellow);
      box-shadow: 0 0 0 3px var(--yellow-tint);
    }
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
    margin-top: 20px;
  }

  .send-button {
    /* Calibre's metrics sit the text ~2px high; uneven padding centres it */
    padding: 14px 22px 10px;
    border: 0;
    border-radius: 999px;
    background-color: var(--button-bg);
    color: var(--button-fg);
    font-family: var(--font-sans);
    font-size: var(--fz-lg);
    line-height: 1;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px -6px var(--navy-shadow);
    }

    &:focus-visible {
      outline: 2px solid var(--yellow);
      outline-offset: 3px;
    }
  }

  .status {
    margin: 0;
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  /* label for screen readers only */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
`;

const Contact = () => {
  const revealContainer = useRef(null);
  const messageRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  // No backend: open the visitor's email app with the message filled in
  const handleSubmit = e => {
    e.preventDefault();
    const text = message.trim();
    if (!text) {
      setStatus('Write a message first.');
      messageRef.current.focus();
      return;
    }
    const subject = encodeURIComponent('Hello from your portfolio');
    window.location.href = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(text)}`;
    setStatus('Opening your email app…');
  };

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">What’s Next?</h2>

      <h2 className="handwritten">
        you scrolled all the way{' '}
        <span className="underlined">
          down
          <svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M2 7 C 20 2, 40 2, 55 6 S 85 11, 98 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </span>{' '}
        here —<br />
        that really means a lot.
      </h2>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <p className="eyebrow">Now your turn</p>
        <p className="intro">
          My inbox is always open for SQA related questions or collaborations. Whether you have a
          question or just want to say hi, I’ll try my best to get back to you!
        </p>

        <label className="sr-only" htmlFor="contact-message">
          Your message
        </label>
        <textarea
          id="contact-message"
          ref={messageRef}
          rows={4}
          placeholder="e.g. Hi Sakib, I'd love to talk about a QA role…"
          value={message}
          onChange={e => {
            setMessage(e.target.value);
            if (status) {
              setStatus('');
            }
          }}
        />

        <div className="actions">
          <button className="send-button" type="submit">
            Send it my way
          </button>
          <p className="status" aria-live="polite">
            {status}
          </p>
        </div>
      </form>
    </StyledContactSection>
  );
};

export default Contact;
