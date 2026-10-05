import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { usePrefersReducedMotion } from '@hooks';

// Constellation background: slowly drifting dots joined by faint lines when
// they come close. Purely ambient — no mouse interaction.

const LINK_DISTANCE = 170; // px; dots closer than this get a connecting line
const DOT_RGB = '136, 146, 176'; // --slate
const LINE_RGB = '255, 214, 10'; // --yellow

const StyledBackground = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const createDots = (count, width, height) =>
  Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 6 + Math.random() * 12; // px per second
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 1.2 + Math.random() * 1.8,
    };
  });

const FloatingParticles = ({ count }) => {
  const canvasRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dots = [];
    let frameId = null;
    let lastTime = null;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Fewer dots on small screens so the effect stays light and uncluttered
      const scale = Math.min(1, (width * height) / (1440 * 900));
      const target = Math.max(18, Math.round(count * scale));

      // Keep existing dots across resizes. Mobile browsers resize the viewport
      // whenever the address bar shows/hides; regenerating would make every dot
      // jump to a new random spot at once (a visible "glitter").
      dots.forEach(dot => {
        dot.x = Math.min(dot.x, width);
        dot.y = Math.min(dot.y, height);
      });
      if (dots.length < target) {
        dots = dots.concat(createDots(target - dots.length, width, height));
      } else {
        dots.length = target;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(${LINE_RGB}, ${(1 - dist / LINK_DISTANCE) * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = `rgba(${DOT_RGB}, 0.75)`;
      dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const step = time => {
      // Cap the delta so dots don't jump after the tab was in the background
      const delta = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      dots.forEach(dot => {
        dot.x += dot.vx * delta;
        dot.y += dot.vy * delta;
        if (dot.x < 0 || dot.x > width) {
          dot.vx *= -1;
          dot.x = Math.max(0, Math.min(width, dot.x));
        }
        if (dot.y < 0 || dot.y > height) {
          dot.vy *= -1;
          dot.y = Math.max(0, Math.min(height, dot.y));
        }
      });

      draw();
      frameId = window.requestAnimationFrame(step);
    };

    const handleResize = () => {
      resize();
      if (prefersReducedMotion) {
        draw();
      }
    };

    resize();
    if (prefersReducedMotion) {
      draw();
    } else {
      frameId = window.requestAnimationFrame(step);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [count, prefersReducedMotion]);

  return (
    <StyledBackground aria-hidden="true">
      <canvas ref={canvasRef} />
    </StyledBackground>
  );
};

FloatingParticles.propTypes = {
  count: PropTypes.number,
};

FloatingParticles.defaultProps = {
  count: 60,
};

export default FloatingParticles;
