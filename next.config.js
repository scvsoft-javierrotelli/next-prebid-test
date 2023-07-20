/** @type {import('next').NextConfig} */
let path = require("path");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.module.rules.push(
      // this separate rule is required to make sure that the Prebid.js files are babel-ified.  this rule will
      // override the regular exclusion from above (for being inside node_modules).
      {
        test: /.js$/,
        include: new RegExp(`\\${path.sep}prebid\\.js`),
        use: {
          loader: "babel-loader",
          // presets and plugins for Prebid.js must be manually specified separate from your other babel rule.
          // this can be accomplished by requiring prebid's .babelrc.js file (requires Babel 7 and Node v8.9.0+)
          // as of Prebid 6, babelrc.js only targets modern browsers. One can change the targets and build for
          // older browsers if they prefer, but integration tests on ie11 were removed in Prebid.js 6.0
          options: require("prebid.js/.babelrc.js"),
        },
      }
    );
    return config;
  },
};

module.exports = nextConfig;
