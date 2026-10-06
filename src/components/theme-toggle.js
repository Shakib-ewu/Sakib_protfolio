import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Light/dark switch. The theme is a data-theme attribute on <html>, which flips
// the CSS variables in styles/variables.js. Both icons are always rendered and
// CSS shows the right one, so the server HTML matches whatever theme the
// pre-paint script in gatsby-ssr.js already applied (no flash, no mismatch).

const STORAGE_KEY = 'theme';
const TRANSITION_MS = 400;

const StyledToggle = styled.button`
  ${({ theme }) => theme.mixins.flexCenter};
  position: relative;
  width: 40px;
  height: 40px;
  margin-left: 15px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--yellow);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover,
  &:focus-visible {
    background-color: var(--yellow-tint);
  }

  @media (max-width: 768px) {
    margin: 0 10px 0 0;
  }

  svg {
    position: absolute;
    width: 22px;
    height: 22px;
    transition: opacity 0.3s var(--easing), transform 0.4s var(--easing);
  }

  /* Dark theme shows the sun (click for light); light theme shows the moon */
  .moon {
    opacity: 0;
    transform: rotate(-90deg) scale(0.5);
  }

  :root[data-theme='light'] & {
    .sun {
      opacity: 0;
      transform: rotate(90deg) scale(0.5);
    }
    .moon {
      opacity: 1;
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    svg {
      transition: none;
    }
  }
`;

const ThemeToggle = () => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.getAttribute('data-theme') === 'light');
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = isLight ? 'dark' : 'light';

    // Fade colours instead of snapping; the class is removed once done
    root.classList.add('theme-transition');
    if (next === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    window.setTimeout(() => root.classList.remove('theme-transition'), TRANSITION_MS);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      // storage can be unavailable (private mode); the switch still works
    }
    setIsLight(!isLight);
  };

  return (
    <StyledToggle
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      title={isLight ? 'Dark theme' : 'Light theme'}>
      <svg
        className="sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true">
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg
        className="moon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </StyledToggle>
  );
};

export default ThemeToggle;
