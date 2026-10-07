import { css } from 'styled-components';

const variables = css`
  :root {
    --dark-navy: #020c1b;
    --navy: #000000;
    --light-navy: #112240;
    --lightest-navy: #233554;
    --navy-shadow: rgba(2, 12, 27, 0.7);
    --dark-slate: #495670;
    --slate: #8892b0;
    --light-slate: #a8b2d1;
    --lightest-slate: #ccd6f6;
    --white: #e6f1ff;
    --yellow: #ffd60a;
    --yellow-tint: rgba(255, 214, 10, 0.1);
    --pink: #f57dff;
    --blue: #57cbff;

    --nav-bg: rgba(0, 0, 0, 0.85);
    --card-bg: rgba(23, 43, 77, 0.3);
    --card-bg-hover: rgba(23, 43, 77, 0.5);
    /* black + mix-blend-mode: screen leaves photos untouched in both themes */
    --photo-overlay: #000000;
    /* read by the birds canvas (comma-separated RGB) */
    --bird-rgb: 255, 214, 10;

    /* neutral surfaces (Contact card) */
    --surface: #141414;
    --surface-border: rgba(255, 255, 255, 0.08);
    --input-bg: #0b0b0b;
    --input-border: rgba(255, 255, 255, 0.1);
    --button-bg: #f2efe8;
    --button-fg: #111111;

    --font-sans: 'Calibre', 'Inter', 'San Francisco', 'SF Pro Text', -apple-system, system-ui,
      sans-serif;
    --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
    --font-hand: 'Caveat', 'Segoe Print', 'Bradley Hand', cursive;

    --fz-xxs: 12px;
    --fz-xs: 13px;
    --fz-sm: 14px;
    --fz-md: 16px;
    --fz-lg: 18px;
    --fz-xl: 20px;
    --fz-xxl: 22px;
    --fz-heading: 32px;

    --border-radius: 4px;
    --nav-height: 100px;
    --nav-scroll-height: 70px;

    --tab-height: 42px;
    --tab-width: 120px;

    --easing: cubic-bezier(0.645, 0.045, 0.355, 1);
    --transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);

    --hamburger-width: 30px;

    --ham-before: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
    --ham-before-active: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
    --ham-after: bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    --ham-after-active: bottom 0.1s ease-out,
      transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  }

  /* Light theme: set by the nav toggle (data-theme on <html>). Same variable
     names, so every component follows without changes. The accent is a deeper
     gold because #ffd60a on white is unreadable (~1.5:1 contrast). */
  :root[data-theme='light'] {
    --dark-navy: #eef1f5;
    --navy: #ffffff;
    --light-navy: #f1f4f8;
    --lightest-navy: #d6dce5;
    --navy-shadow: rgba(15, 23, 42, 0.12);
    --dark-slate: #94a3b8;
    --slate: #475569;
    --light-slate: #334155;
    --lightest-slate: #0f172a;
    --white: #0f172a;
    --yellow: #a16207;
    --yellow-tint: rgba(161, 98, 7, 0.1);

    --nav-bg: rgba(255, 255, 255, 0.85);
    --card-bg: rgba(15, 23, 42, 0.03);
    --card-bg-hover: rgba(15, 23, 42, 0.06);
    --bird-rgb: 161, 98, 7;

    --surface: #f6f7f9;
    --surface-border: rgba(15, 23, 42, 0.1);
    --input-bg: #ffffff;
    --input-border: rgba(15, 23, 42, 0.15);
    --button-bg: #0f172a;
    --button-fg: #ffffff;
  }
`;

export default variables;
