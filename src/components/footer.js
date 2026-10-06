import React from 'react';
import styled from 'styled-components';
import { Icon } from '@components/icons';
import { socialMedia } from '@config';

const StyledFooter = styled.footer`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  height: auto;
  min-height: 70px;
  padding: 25px 15px;  /* ✅ increase top/bottom from 15px to 25px */
  text-align: center;
  gap: 10px;  /* ✅ ADD — controls space between each child element */
`;

const StyledScrollToTop = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  padding: 10px;
  margin: 0 auto 15px;
  border: 2px solid var(--yellow);
  border-radius: 12px;
  background-color: transparent;
  color: var(--yellow);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  outline: none;

  &:hover,
  &:focus {
    background-color: var(--yellow-tint);
    transform: translateY(-3px);
  }

  svg {
    width: 24px;
    height: 24px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const StyledSocialLinks = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    max-width: 270px;
    margin: 0 auto 10px;
    color: var(--light-slate);
  }

  ul {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    a {
      padding: 10px;
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
`;

const StyledCredit = styled.div`
  /* Muted on purpose: neutral grey that still meets WCAG AA contrast (4.5:1)
     on both the black and the white theme */
  color: #767676;
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  line-height: 2.5;
  margin-top: 0;

  a {
    color: inherit;

    &:hover,
    &:focus-visible {
      color: var(--slate);
      text-decoration: underline;
    }
  }
`;

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <StyledFooter>
      <StyledScrollToTop onClick={scrollToTop} aria-label="Scroll to top">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <title>Scroll to Top</title>
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </StyledScrollToTop>

      <StyledSocialLinks>
        <ul>
          {socialMedia &&
            socialMedia.map(({ name, url }, i) => (
              <li key={i}>
                <a href={url} aria-label={name}>
                  <Icon name={name} />
                </a>
              </li>
            ))}
        </ul>
      </StyledSocialLinks>

      <StyledCredit tabIndex="-1">
        Originally built by{' '}
        <a href="https://brittanychiang.com/" target="_blank" rel="noreferrer">
          Brittany Chiang
        </a>{' '}
        &amp; Redesigned by Sakib Sarkar
      </StyledCredit>
    </StyledFooter>
  );
};

export default Footer;
