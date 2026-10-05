/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

const React = require('react');

// Paint the page background before any JS/CSS loads, so a reload never
// flashes the browser's default white background. Keep in sync with --navy.
exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <style
      key="initial-background"
      dangerouslySetInnerHTML={{ __html: 'html,body{background-color:#000000;}' }}
    />,
  ]);
};
