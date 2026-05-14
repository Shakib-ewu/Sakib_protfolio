import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { usePrefersReducedMotion } from '@hooks';

const StyledAwardsSection = styled.section`
  max-width: 1000px;
`;

const StyledAwardsGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const StyledAwardCard = styled.li`
  position: relative;
  padding: 30px;
  border: 1px solid var(--lightest-navy);
  border-radius: var(--border-radius);
  background-color: rgba(23, 43, 77, 0.3);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 20px;
  }

  &:hover {
    background-color: rgba(23, 43, 77, 0.5);
    border-color: var(--green);
    transform: translateY(-5px);
  }

  .award-date {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    margin-bottom: 15px;
    letter-spacing: 0.05em;
  }

  h3 {
    margin: 0 0 15px 0;
    font-size: var(--fz-xxl);
    font-weight: 600;
    line-height: 1.3;
    color: var(--lightest-slate);

    @media (max-width: 480px) {
      font-size: var(--fz-lg);
    }
  }

  .award-location {
    color: var(--slate);
    font-size: var(--fz-sm);
    margin-bottom: 8px;
  }

  .award-description {
    color: var(--light-slate);
    font-size: var(--fz-sm);
    margin-bottom: 20px;
    line-height: 1.6;
  }

  .award-top-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;

    @media (max-width: 360px) {
      flex-direction: column;
      gap: 10px;
    }

    .icon-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: rgba(16, 185, 129, 0.15);
      border: 1px solid var(--green);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }

    .award-year {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      .award-tag {
        padding: 3px 10px;
        border-radius: 20px;
        border: 1px solid var(--green);
        color: var(--green);
        font-size: var(--fz-xxs);
        white-space: nowrap;
      }
    }
  }

  .award-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      border-radius: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      font-weight: 500;
      letter-spacing: 0.05em;
      border: 1px solid;

      @media (max-width: 480px) {
        font-size: var(--fz-xxs);
        padding: 5px 12px;
      }

      &.award-badge {
        color: var(--green);
        border-color: var(--green);
        background-color: rgba(16, 185, 129, 0.1);
      }

      &.org-badge {
        color: var(--slate);
        border-color: var(--slate);
        background-color: transparent;
      }
    }
  }
`;

const Awards = () => {
  const data = useStaticQuery(graphql`
    query {
      awards: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/awards/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              award
              organization
              location
              range
              icon
            }
            html
          }
        }
      }
    }
  `);

  const awardsData = data.awards.edges;
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    sr.reveal(revealContainer.current, srConfig());
  }, []);

  return (
    <StyledAwardsSection id="awards" ref={revealContainer}>
      <h2 className="numbered-heading">Some Recognitions I've Received</h2>

      <StyledAwardsGrid>
        {awardsData &&
          awardsData.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { title, award, organization, range, location, icon } = frontmatter;

            return (
              <StyledAwardCard key={i}>
                <div className="award-top-row">
                  <div className="icon-circle">{icon}</div>
                  <div className="award-year">
                    <span className="award-tag">Award</span>
                    <span>{range}</span>
                  </div>
                </div>

                <h3>{title}</h3>
                <p className="award-location">{location}</p>
                <div className="award-description" dangerouslySetInnerHTML={{ __html: html }} />
                <div className="award-badges">
                  <span className="badge award-badge">{award}</span>
                  <span className="badge org-badge">{organization}</span>
                </div>
              </StyledAwardCard>
            );
          })}
      </StyledAwardsGrid>
    </StyledAwardsSection>
  );
};

export default Awards;
