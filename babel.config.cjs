// This Babel config is only for running Jest.

module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], ['@babel/preset-typescript']],
};
