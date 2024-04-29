module.exports = {
  trailingSlash: true,
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  publicRuntimeConfig: {
    apiUrl:
      process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
        ? 'https://www.channel360.co.za/webapi'
        : 'https://staging.channel360.co.za/webapi',
    apiUrlv1:
      process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
        ? 'https://www.channel360.co.za/v1.1'
        : 'https://staging.channel360.co.za/v1.1',
  },
  images: {
    domains: [
      'media.smooch.io',
      'www.gravatar.com',
      'channel360-template-tags.s3.af-south-1.amazonaws.com',
    ],
  },
};
