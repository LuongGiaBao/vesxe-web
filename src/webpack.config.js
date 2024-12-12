const path = require('path');

module.exports = {
  // Other configurations...

  resolve: {
    fallback: {
      fs: false, // If you don't need 'fs'
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
    },
  },
};
