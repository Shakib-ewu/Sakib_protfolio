/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

const React = require('react');

// Runs before the first paint: applies a saved light theme (set by the nav
// toggle) so returning visitors never see a flash of the dark theme.
const themeScript = `(function(){try{if(localStorage.getItem('theme')==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`;

// Paint the page background before any JS/CSS loads, so a reload never flashes
// the browser's default background. Keep in sync with --navy in each theme.
const backgroundCss =
  'html,body{background-color:#000000;}' +
  'html[data-theme=light],html[data-theme=light] body{background-color:#ffffff;}';

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script key="theme-init" dangerouslySetInnerHTML={{ __html: themeScript }} />,
    <style key="initial-background" dangerouslySetInnerHTML={{ __html: backgroundCss }} />,
  ]);
};
