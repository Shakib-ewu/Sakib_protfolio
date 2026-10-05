import React from 'react';
import styled, { keyframes } from 'styled-components';
import { navDelay } from '@utils';

// Pure CSS entrance: the text is in the server-rendered HTML and animates
// exactly once, instead of being removed and re-added when React hydrates.
const fadeUp = keyframes`
  from {
    opacity: 0.01; /* not 0: fully transparent elements are ignored for LCP */
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledHeroSection = styled.section`
  .hero-item {
    animation: ${fadeUp} 300ms var(--easing) both;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  /* svh = the viewport height with the mobile address bar showing. Unlike vh it
     doesn't change as the bar slides in/out, so the hero text doesn't jump. */
  min-height: 100svh;
  height: 100svh;
  padding: 0;

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--yellow);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }
  h2.big-heading {
    font-size: 70px; /* Large name */
  }

  h3 {
    margin-top: 5px;
    color: var(--);
    line-height: 0.9;
    font-size: 32px;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const Hero = () => {
  const one = <h1>Hi, my name is</h1>;
  const two = <h2 className="big-heading">Sakib Sarkar</h2>;
  const three = (
    <h3 className="big-heading">
      SQA Engineer @{' '}
      <a href="https://www.bevycommerce.com/" target="_blank" rel="noopener noreferrer">
        Bevy Commerce
      </a>
    </h3>
  );

  const items = [one, two, three];

  return (
    <StyledHeroSection>
      {items.map((item, i) => (
        <div key={i} className="hero-item" style={{ animationDelay: `${navDelay + i * 100}ms` }}>
          {item}
        </div>
      ))}
    </StyledHeroSection>
  );
};

export default Hero;
