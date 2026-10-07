import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { usePrefersReducedMotion } from '@hooks';

// A small flock of birds that enters from the right edge and flies diagonally
// up-left, leaving through the top; birds that leave re-enter from the right.
// They flock with the classic "boids" rules (Craig Reynolds): keep apart from
// close neighbours, match their heading, and stay with the group. Depth is faked
// with a perspective projection, so farther birds are smaller and fainter.
// Birds near the mouse swerve away sideways. Drawn on a 2D canvas (no three.js)
// to keep the page light.

const DEPTH = 300; // px of simulated depth
const FOCAL = 500; // perspective strength: scale = FOCAL / (FOCAL + z)
const MIN_SPEED = 40; // px per second
const MAX_SPEED = 70;
const FLEE_SPEED = 95; // speed cap while dodging: a gentle sidestep, not a dash
const EDGE_GUARD = 140; // near the right edge / top, dodge inward so birds stay on screen
const NEIGHBOUR_RADIUS = 120;
const SEPARATION_RADIUS = 42;
const MOUSE_RADIUS = 90; // birds closer than this to the cursor sidestep away
// Flight direction: up and to the left (unit vector)
const HEADING_X = -Math.SQRT1_2;
const HEADING_Y = -Math.SQRT1_2;

const StyledBirds = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20; /* above the nav so birds can fly out through the top */
  pointer-events: none; /* never blocks clicks */

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

// Place a bird just off the right edge, roughly a third of the way down.
// `onScreen` places it already partway along its path (used for half the flock
// on page load, so the corner isn't empty while the first birds fly in).
const spawn = (bird, width, height, onScreen) => {
  if (onScreen) {
    const along = Math.random() * Math.min(width, height) * 0.3; // distance flown so far
    bird.x = width - 10 - along * Math.SQRT1_2;
    bird.y = height * (0.24 + Math.random() * 0.2) - along * Math.SQRT1_2;
  } else {
    bird.x = width + 10 + Math.random() * 70;
    bird.y = height * (0.24 + Math.random() * 0.2);
  }
  bird.z = Math.random() * DEPTH;
  const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
  const wobble = (Math.random() - 0.5) * 0.3;
  bird.vx = (HEADING_X - wobble) * speed;
  bird.vy = (HEADING_Y + wobble) * speed;
  bird.vz = (Math.random() - 0.5) * 10;
  return bird;
};

const createBirds = (count, width, height) =>
  Array.from({ length: count }, (_, i) =>
    spawn(
      {
        phase: Math.random() * Math.PI * 2, // wing-flap phase
        flapRate: 6 + Math.random() * 3, // radians per second
      },
      width,
      height,
      i % 2 === 0, // half already on screen, half about to fly in
    ),
  );

const FlyingBirds = ({ count }) => {
  const canvasRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let birds = [];
    let frameId = null;
    let lastTime = null;
    let birdRgb = '';
    const mouse = { x: -9999, y: -9999 };

    const readColors = () => {
      birdRgb = getComputedStyle(document.documentElement).getPropertyValue('--bird-rgb').trim();
    };

    // Depth only changes size and opacity; positions stay put so the flock
    // flies the full diagonal from the right edge to the top
    const project = b => ({ s: FOCAL / (FOCAL + Math.max(0, b.z)), px: b.x, py: b.y });

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Fewer birds on small screens; keep existing birds across resizes
      const target = width < 700 ? Math.round(count * 0.6) : count;
      if (!birds.length) {
        birds = createBirds(target, width, height);
      } else if (birds.length > target) {
        birds.length = target;
      } else if (birds.length < target) {
        birds = birds.concat(createBirds(target - birds.length, width, height));
      }
    };

    const update = dt => {
      for (let i = 0; i < birds.length; i++) {
        const b = birds[i];
        // alignment (a*), cohesion (c*) and separation (s*) accumulators
        let ax = 0;
        let ay = 0;
        let cx = 0;
        let cy = 0;
        let sx = 0;
        let sy = 0;
        let n = 0;

        for (let j = 0; j < birds.length; j++) {
          if (i === j) {
            continue;
          }
          const o = birds[j];
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          const dz = o.z - b.z;
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < NEIGHBOUR_RADIUS * NEIGHBOUR_RADIUS) {
            n++;
            ax += o.vx;
            ay += o.vy;
            cx += o.x;
            cy += o.y;
            if (d2 < SEPARATION_RADIUS * SEPARATION_RADIUS && d2 > 0) {
              sx -= dx / d2;
              sy -= dy / d2;
            }
          }
        }

        if (n) {
          b.vx += (ax / n - b.vx) * 0.6 * dt; // match neighbours' heading
          b.vy += (ay / n - b.vy) * 0.6 * dt;
          b.vx += (cx / n - b.x) * 0.25 * dt; // stay with the group
          b.vy += (cy / n - b.y) * 0.25 * dt;
          b.vx += sx * 1400 * dt; // keep a little personal space
          b.vy += sy * 1400 * dt;
        }

        // Keep migrating up-left
        const speed = Math.hypot(b.vx, b.vy) || 1;
        b.vx += (HEADING_X * speed - b.vx) * 0.5 * dt;
        b.vy += (HEADING_Y * speed - b.vy) * 0.5 * dt;

        // Sidestep (left or right) away from a nearby cursor. Near the right edge
        // or the top, always dodge inward so the bird doesn't leave the screen.
        let fleeing = false;
        const { s, px, py } = project(b);
        const mdx = px - mouse.x;
        const mdy = py - mouse.y;
        const md = Math.hypot(mdx, mdy);
        if (md < MOUSE_RADIUS) {
          fleeing = true;
          const strength = (1 - md / MOUSE_RADIUS) * 300 * dt;
          let side = mdx >= 0 ? 1 : -1;
          if (side > 0 && px > width - EDGE_GUARD) {
            side = -1;
          }
          let lift = mdy / (md || 1);
          if (lift < 0 && py < EDGE_GUARD) {
            lift = Math.abs(lift);
          }
          b.vx += (side * strength) / s;
          b.vy += (lift * strength * 0.4) / s;
        }

        // Depth drifts gently and stays within range
        b.vz += (Math.random() - 0.5) * 8 * dt;
        if (b.z < 0) {
          b.vz += 30 * dt;
        }
        if (b.z > DEPTH) {
          b.vz -= 30 * dt;
        }

        const current = Math.hypot(b.vx, b.vy) || 1;
        const cap = fleeing ? FLEE_SPEED : MAX_SPEED;
        const clamped = Math.min(cap, Math.max(MIN_SPEED, current));
        b.vx = (b.vx / current) * clamped;
        b.vy = (b.vy / current) * clamped;
      }

      birds.forEach(b => {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.z += b.vz * dt;
        b.phase += b.flapRate * dt;
        // Left through the top or left side: come back in from the right
        const { px, py } = project(b);
        if (py < -40 || px < -40 || py > height + 40) {
          spawn(b, width, height, false);
        }
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      // Far birds first, so near birds are drawn on top
      const sorted = birds.slice().sort((a, b) => b.z - a.z);
      sorted.forEach(b => {
        const { s, px, py } = project(b);
        if (px < -30 || px > width + 30) {
          return;
        }
        // Seen from behind/below, a bird reads as a "V": wings spread sideways,
        // tilted a little with its heading, wingtips rising and falling as it flaps
        const size = 15 * s;
        const speed = Math.hypot(b.vx, b.vy) || 1;
        const bank = (b.vy / speed) * 0.3 * Math.sign(b.vx || 1);
        const cos = Math.cos(bank);
        const sin = Math.sin(bank);
        const rotate = (x, y) => [px + x * cos - y * sin, py + x * sin + y * cos];

        const flap = Math.sin(b.phase); // -1 wings down … 1 wings up
        const span = size * (0.95 - 0.12 * Math.abs(flap));
        // Wingtips always sit well above the body (a clear V) and rise/fall with the flap
        const lift = -size * (0.55 + 0.25 * flap);
        const [lx, ly] = rotate(-span, lift);
        const [rx, ry] = rotate(span, lift);
        const [ix, iy] = rotate(0, -size * 0.16); // inner notch: thin wings, deep V

        ctx.fillStyle = `rgba(${birdRgb}, ${(0.45 + 0.5 * (s - 0.62) / 0.38).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(px, py);
        ctx.lineTo(rx, ry);
        ctx.lineTo(ix, iy);
        ctx.closePath();
        ctx.fill();
      });
    };

    const step = time => {
      // Cap the step so the flock doesn't teleport after the tab was hidden
      const dt = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      update(dt);
      draw();
      frameId = window.requestAnimationFrame(step);
    };

    const handleResize = () => {
      resize();
      if (prefersReducedMotion) {
        draw();
      }
    };
    const handleMouseMove = e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const themeObserver = new MutationObserver(() => {
      readColors();
      if (prefersReducedMotion) {
        draw();
      }
    });

    readColors();
    resize();
    if (prefersReducedMotion) {
      // Still frame: show the flock mid-flight instead of off-screen
      birds.forEach((b, i) => {
        b.x = width * (0.78 + (i % 4) * 0.04);
        b.y = height * (0.18 + Math.floor(i / 4) * 0.06 + (i % 4) * 0.02);
      });
      draw();
    } else {
      frameId = window.requestAnimationFrame(step);
    }
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      themeObserver.disconnect();
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [count, prefersReducedMotion]);

  return (
    <StyledBirds aria-hidden="true">
      <canvas ref={canvasRef} />
    </StyledBirds>
  );
};

FlyingBirds.propTypes = {
  count: PropTypes.number,
};

FlyingBirds.defaultProps = {
  count: 8,
};

export default FlyingBirds;
