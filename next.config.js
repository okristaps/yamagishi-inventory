/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  basePath: '',
  // Allow external access for mobile development
  // Allow cross-origin requests from development devices
  allowedDevOrigins: ['192.168.1.101'],
  webpack: (config, { isServer }) => {
    // Don't bundle server-side modules on client side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        child_process: false,
        worker_threads: false,
        'pg-native': false,
        'better-sqlite3': false,
        sqlite3: false,
        'react-native-sqlite-storage': false,
        '@sap/hana-client': false,
        mysql: false,
        mysql2: false,
        oracledb: false,
        'pg-query-stream': false,
        'sql.js': false,
        'typeorm-aurora-data-api-driver': false,
      };
    }
    
    // Exclude problematic TypeORM modules
    config.externals = config.externals || [];
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
      'encoding': 'commonjs encoding',
    });
    
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**',
      },
    ],
    unoptimized: true,
  },
  swcMinify: true,
  transpilePackages: [
    '@ionic/react',
    '@ionic/core',
    '@stencil/core',
    'ionicons',
  ],
};
