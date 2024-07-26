/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    /**
     * Critical: prevents " ⨯ ./node_modules/canvas/build/Release/canvas.node
     * Module parse failed: Unexpected character '�' (1:0)" error
     */
    config.resolve.alias.canvas = false;

    // You may not need this, it's just to support moduleResolution: 'node16'
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
    };

    return config;
  },

  // https://github.com/wojtekmaj/react-pdf/wiki/Upgrade-guide-from-version-8.x-to-9.x
  swcMinify: false,
};

export default nextConfig;
