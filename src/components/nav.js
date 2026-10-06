import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import styled, { css, keyframes } from 'styled-components';
import { navLinks } from '@config';
import { useScrollDirection } from '@hooks';
import { Menu, ThemeToggle } from '@components';
import { IconLogo, IconHex } from '@components/icons';

// Pure CSS entrance (home page only): every item plays its full animation,
// staggered by animation-delay, and nothing is removed/re-added on hydration.
const STAGGER_MS = 80;

const fadeIn = keyframes`
  from {
    opacity: 0.01;
  }
  to {
    opacity: 1;
  }
`;

const fadeDown = keyframes`
  from {
    opacity: 0.01;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledHeader = styled.header`
  .nav-fade-in {
    animation: ${fadeIn} 400ms var(--easing) both;
  }

  .nav-fade-down {
    animation: ${fadeDown} 400ms var(--easing) both;
  }

  @media (prefers-reduced-motion: reduce) {
    .nav-fade-in,
    .nav-fade-down {
      animation: none;
    }
  }

  ${({ theme }) => theme.mixins.flexBetween};
  position: fixed;
  top: 0;
  z-index: 11;
  padding: 0px 50px;
  width: 100%;
  height: var(--nav-height);
  background-color: var(--nav-bg);
  filter: none !important;
  pointer-events: auto !important;
  user-select: auto !important;
  backdrop-filter: blur(10px);
  transition: var(--transition);

  @media (max-width: 1080px) {
    padding: 0 40px;
  }
  @media (max-width: 768px) {
    padding: 0 25px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${props =>
    props.scrollDirection === 'up' &&
      !props.scrolledToTop &&
      css`
        height: var(--nav-scroll-height);
        transform: translateY(0px);
        background-color: var(--nav-bg);
        box-shadow: 0 10px 30px -10px var(--navy-shadow);
      `};

    ${props =>
    props.scrollDirection === 'down' &&
      !props.scrolledToTop &&
      css`
        height: var(--nav-scroll-height);
        transform: translateY(calc(var(--nav-scroll-height) * -1));
        box-shadow: 0 10px 30px -10px var(--navy-shadow);
      `};
  }
`;

const StyledNav = styled.nav`
  ${({ theme }) => theme.mixins.flexBetween};
  position: relative;
  width: 100%;
  color: var(--lightest-slate);
  font-family: var(--font-mono);
  counter-reset: item 0;
  z-index: 12;

  .nav-actions {
    display: flex;
    align-items: center;
  }

  .logo {
    ${({ theme }) => theme.mixins.flexCenter};

    a {
      color: var(--yellow);
      width: 42px;
      height: 42px;
      position: relative;
      z-index: 1;

      .hex-container {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        @media (prefers-reduced-motion: no-preference) {
          transition: var(--transition);
        }
      }

      .logo-container {
        position: relative;
        z-index: 1;
        svg {
          fill: none;
          user-select: none;
          @media (prefers-reduced-motion: no-preference) {
            transition: var(--transition);
          }
          polygon {
            fill: var(--navy);
          }
        }
      }

      &:hover,
      &:focus {
        outline: 0;
        transform: translate(-4px, -4px);
        .hex-container {
          transform: translate(4px, 3px);
        }
      }
    }
  }
`;

const StyledLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }

  ol {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      margin: 0 5px;
      position: relative;
      counter-increment: item 1;
      font-size: var(--fz-xs);

      a {
        padding: 10px;

        &:before {
          content: '0' counter(item) '.';
          margin-right: 5px;
          color: var(--yellow);
          font-size: var(--fz-xxs);
          text-align: right;
        }
      }
    }
  }

  .resume-button {
    ${({ theme }) => theme.mixins.smallButton};
    margin-left: 15px;
    font-size: var(--fz-xs);
  }
`;

const Nav = ({ isHome }) => {
  const scrollDirection = useScrollDirection('down');
  const [scrolledToTop, setScrolledToTop] = useState(true);

  const handleScroll = () => {
    setScrolledToTop(window.pageYOffset < 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Entrance animation props for the item at position `i` (home page only)
  const enter = (className, i = 0) =>
    isHome ? { className, style: { animationDelay: `${i * STAGGER_MS}ms` } } : {};

  const Logo = (
    <div className={`logo ${isHome ? 'nav-fade-in' : ''}`} tabIndex="-1">
      {isHome ? (
        <a href="/" aria-label="home">
          <div className="hex-container">
            <IconHex />
          </div>
          <div className="logo-container">
            <IconLogo />
          </div>
        </a>
      ) : (
        <Link to="/" aria-label="home">
          <div className="hex-container">
            <IconHex />
          </div>
          <div className="logo-container">
            <IconLogo />
          </div>
        </Link>
      )}
    </div>
  );

  const ResumeLink = (
    <a className="resume-button" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
      Resume
    </a>
  );

  return (
    <StyledHeader scrollDirection={scrollDirection} scrolledToTop={scrolledToTop}>
      <StyledNav>
        {Logo}

        <div className="nav-actions">
          <StyledLinks>
            <ol>
              {navLinks &&
                navLinks.map(({ url, name }, i) => (
                  <li key={i} {...enter('nav-fade-down', i + 1)}>
                    <Link to={url}>{name}</Link>
                  </li>
                ))}
            </ol>

            <div {...enter('nav-fade-down', navLinks.length + 1)}>{ResumeLink}</div>
          </StyledLinks>

          <div {...enter('nav-fade-down', navLinks.length + 2)}>
            <ThemeToggle />
          </div>

          <Menu buttonClassName={isHome ? 'nav-fade-in' : undefined} />
        </div>
      </StyledNav>
    </StyledHeader>
  );
};

Nav.propTypes = {
  isHome: PropTypes.bool,
};

export default Nav;
