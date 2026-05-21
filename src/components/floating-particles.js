import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

const COLORS = ['#c8006e', '#9b1fad', '#e0005a', '#6a0aaa', '#1a0a3e'];

const generateParticles = (count = 280) => {
  // We need viewport size to radiate from center.
  // Use percentage-based center offset as a fallback for SSR safety.
  const W = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const H = typeof window !== 'undefined' ? window.innerHeight : 900;
  const cx = W / 2;
  const cy = H / 2;

  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * Math.max(W, H) * 0.52;

    // Absolute px start position (radiated from center)
    const startX = cx + Math.cos(angle) * dist;
    const startY = cy + Math.sin(angle) * dist;

    // Drift direction: mostly outward with slight variance
    const driftAngle = angle + (Math.random() - 0.5) * 0.7;
    const driftDist = 40 + Math.random() * 90;
    const dx = Math.cos(driftAngle) * driftDist;
    const dy = Math.sin(driftAngle) * driftDist;

    // Dash shape: some wide, some tall
    const isWide = Math.random() > 0.45;
    const width = isWide ? 3 + Math.random() * 5 : 1.5 + Math.random() * 2.5;
    const height = isWide ? 1.5 + Math.random() * 2 : 3 + Math.random() * 5;

    return {
      id: i,
      startX,
      startY,
      dx,
      dy,
      width,
      height,
      rot: Math.random() * 360,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 18 + Math.random() * 28,
      delay: -(Math.random() * (18 + Math.random() * 28)), // negative = start mid-animation
      maxOpacity: 0.45 + Math.random() * 0.45,
    };
  });
};

// Each particle drifts outward and fades in/out
const drift = (dx, dy, rot) => keyframes`
  0%   { opacity: 0;   transform: translate(0, 0) rotate(${rot}deg); }
  10%  { opacity: 1; }
  85%  { opacity: 1; }
  100% { opacity: 0;   transform: translate(${dx}px, ${dy}px) rotate(${rot + 20}deg); }
`;

const StyledParticles = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
`;

const Particle = styled.div`
  position: absolute;
  border-radius: 50%;
  opacity: 0;

  left: ${({ $startX }) => $startX}px;
  top: ${({ $startY }) => $startY}px;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  background-color: ${({ $color }) => $color};

  animation: ${({ $dx, $dy, $rot }) => drift($dx, $dy, $rot)}
    ${({ $duration }) => $duration}s
    linear
    ${({ $delay }) => $delay}s
    infinite;

  /* Clamp actual opacity by maxOpacity via filter — styled-components
     can't interpolate CSS custom props in keyframes cleanly, so we
     scale down the whole element instead */
  opacity: 0;
  filter: opacity(${({ $maxOpacity }) => $maxOpacity});
`;

const FloatingParticles = ({ count = 280 }) => {
  const particles = useMemo(() => generateParticles(count), [count]);

  return (
    <StyledParticles>
      {particles.map(p => (
        <Particle
          key={p.id}
          $startX={p.startX}
          $startY={p.startY}
          $dx={p.dx}
          $dy={p.dy}
          $width={p.width}
          $height={p.height}
          $rot={p.rot}
          $color={p.color}
          $duration={p.duration}
          $delay={p.delay}
          $maxOpacity={p.maxOpacity}
        />
      ))}
    </StyledParticles>
  );
};

export default FloatingParticles;