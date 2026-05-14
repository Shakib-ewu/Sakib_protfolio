import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import { KEY_CODES } from '@utils';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledSkillsSection = styled.section`
  max-width: 700px;

  .inner {
    display: flex;

    @media (max-width: 600px) {
      display: block;
    }

    @media (min-width: 700px) {
      min-height: 340px;
    }
  }
`;

const StyledTabList = styled.div`
  position: relative;
  z-index: 3;
  width: max-content;
  padding: 0;
  margin: 0;
  list-style: none;

  /* ── DESKTOP: unchanged vertical list ── */

  /* ── MOBILE: wrap pills into rows ── */
  @media (max-width: 600px) {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 8px;
    padding: 4px 0 12px;
    margin: 0 0 16px 0;
  }
`;

const StyledTabButton = styled.button`
  /* ─── DESKTOP styles (unchanged) ─── */
  ${({ theme }) => theme.mixins.link};
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--tab-height);
  padding: 0 20px 2px;
  border-left: 2px solid var(--lightest-navy);
  background-color: transparent;
  color: var(--slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  text-align: left;
  white-space: nowrap;
  transition: background-color 0.2s ease, color 0.2s ease;

  /* desktop active */
  &[aria-selected='true'] {
    color: var(--green);
  }

  @media (max-width: 768px) {
    padding: 0 15px 2px;
  }

  /* ─── MOBILE pill styles ─── */
  @media (max-width: 600px) {
    /* layout reset */
    width: auto;
    height: auto;
    border-left: none;
    border-radius: 999px;
    white-space: nowrap;
    text-align: center;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;

    /* ── INACTIVE pill ── */
    padding: 7px 16px;
    background-color: transparent;
    border: 1.5px solid var(--lightest-navy);
    color: var(--slate) !important; /* !important beats mixins.link */

    /* ── ACTIVE pill ──
       Use && to double specificity so it beats the mixin AND
       the base [aria-selected] rule above */
    &&[aria-selected='true'] {
      background-color: var(--green);
      border-color: var(--green);
      color: var(--navy) !important; /* dark navy on green = readable */
      font-weight: 700;
    }

    /* ── HOVER on inactive only ── */
    &&[aria-selected='false']:hover,
    &&[aria-selected='false']:focus {
      background-color: var(--light-navy);
      border-color: var(--green);
      color: var(--green) !important;
    }
  }

  /* Desktop hover */
  @media (min-width: 601px) {
    &:hover,
    &:focus {
      background-color: var(--light-navy);
    }
  }
`;

const StyledHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 2px;
  height: var(--tab-height);
  border-radius: var(--border-radius);
  background: var(--green);
  transform: translateY(calc(${({ activeTabId }) => activeTabId} * var(--tab-height)));
  transition: transform 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition-delay: 0.1s;

  /* Hidden on mobile — pill buttons handle active state */
  @media (max-width: 600px) {
    display: none;
  }
`;

const StyledTabPanels = styled.div`
  position: relative;
  width: 100%;
  margin-left: 20px;

  @media (max-width: 600px) {
    margin-left: 0;
  }
`;

const StyledTabPanel = styled.div`
  width: 100%;
  height: auto;
  padding: 10px 5px;

  @media (max-width: 600px) {
    padding: 20px 16px; /* comfortable inner breathing room */
    background-color: var(--light-navy);
    border-radius: 10px;
    border: 1px solid var(--lightest-navy);
  }

  ul {
    ${({ theme }) => theme.mixins.fancyList};
  }

  h3 {
    margin-bottom: 20px;
    font-size: var(--fz-xxl);
    font-weight: 500;
    line-height: 1.3;
    color: var(--light-slate);

    @media (max-width: 600px) {
      font-size: var(--fz-xl);
      margin-bottom: 14px;
    }
  }

  /* skill badges rendered from markdown HTML */
  .skill-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    margin: 5px 6px 5px 0;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    cursor: default;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);

    @media (max-width: 600px) {
      font-size: 12px;
      padding: 5px 11px;
      gap: 6px;
      margin: 4px 4px 4px 0;
    }

    img {
      width: 14px;
      height: 14px;
      filter: invert(1) brightness(10);
      flex-shrink: 0;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    }
  }
`;

const Skills = () => {
  const data = useStaticQuery(graphql`
    query {
      skills: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/skills/" } }
        sort: { fields: [frontmatter___order], order: ASC }
      ) {
        edges {
          node {
            frontmatter {
              title
              category
              order
            }
            html
          }
        }
      }
    }
  `);

  const skillsData = data.skills.edges;

  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState(null);
  const tabs = useRef([]);
  const revealContainer = useRef(null);
  const revealTitle = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    sr.reveal(revealContainer.current, srConfig());
    sr.reveal(revealTitle.current, srConfig());
  }, []);

  const focusTab = () => {
    if (tabs.current[tabFocus]) {
      tabs.current[tabFocus].focus();
      return;
    }
    if (tabFocus >= tabs.current.length) {
      setTabFocus(0);
    }
    if (tabFocus < 0) {
      setTabFocus(tabs.current.length - 1);
    }
  };

  useEffect(() => focusTab(), [tabFocus]);

  const onKeyDown = e => {
    switch (e.key) {
      case KEY_CODES.ARROW_UP: {
        e.preventDefault();
        setTabFocus(tabFocus - 1);
        break;
      }
      case KEY_CODES.ARROW_DOWN: {
        e.preventDefault();
        setTabFocus(tabFocus + 1);
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <StyledSkillsSection id="skills" ref={revealContainer}>
      <h2 className="numbered-heading" ref={revealTitle}>
        What I've Used So Far
      </h2>

      <div className="inner">
        <StyledTabList role="tablist" aria-label="Skills tabs" onKeyDown={e => onKeyDown(e)}>
          {skillsData &&
            skillsData.map(({ node }, i) => {
              const { title } = node.frontmatter;
              return (
                <StyledTabButton
                  key={i}
                  isActive={activeTabId === i}
                  onClick={() => setActiveTabId(i)}
                  ref={el => (tabs.current[i] = el)}
                  id={`tab-${i}`}
                  role="tab"
                  tabIndex={activeTabId === i ? '0' : '-1'}
                  aria-selected={activeTabId === i ? true : false}
                  aria-controls={`panel-${i}`}>
                  <span>{title}</span>
                </StyledTabButton>
              );
            })}
          <StyledHighlight activeTabId={activeTabId} />
        </StyledTabList>

        <StyledTabPanels>
          {skillsData &&
            skillsData.map(({ node }, i) => {
              const { html } = node;

              return (
                <CSSTransition key={i} in={activeTabId === i} timeout={250} classNames="fade">
                  <StyledTabPanel
                    id={`panel-${i}`}
                    role="tabpanel"
                    tabIndex={activeTabId === i ? '0' : '-1'}
                    aria-labelledby={`tab-${i}`}
                    aria-hidden={activeTabId !== i}
                    hidden={activeTabId !== i}>
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                  </StyledTabPanel>
                </CSSTransition>
              );
            })}
        </StyledTabPanels>
      </div>
    </StyledSkillsSection>
  );
};

export default Skills;
