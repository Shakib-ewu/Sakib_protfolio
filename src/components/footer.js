import React from 'react';
import styled from 'styled-components';
import { Icon } from '@components/icons';
import { socialMedia } from '@config';

const StyledFooter = styled.footer`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  height: auto;
  min-height: 70px;
  padding: 15px;
  text-align: center;
`;

const StyledScrollToTop = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  padding: 10px;
  margin: 0 auto 25px;
  border: 2px solid var(--green);
  border-radius: 12px;
  background-color: transparent;
  color: var(--green);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  outline: none;

  &:hover,
  &:focus {
    background-color: rgba(100, 255, 218, 0.1);
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
  color: var(--light-slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  line-height: 1;
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
