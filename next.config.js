/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  output: 'export',
  trailingSlash: true,
  basePath: '',
  allowedDevOrigins: ['192.168.1.*', '10.0.2.2'],

  compiler: {
    removeConsole: true,
  },

  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', '@radix-ui/react-dialog'],
    webVitalsAttribution: ['CLS', 'LCP'],
  },

  poweredByHeader: false,
  webpack: (config, { isServer }) => {
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
        'react-native': false,
        '@sap/hana-client': false,
        '@sap/hana-client/extension/Stream': false,
        mysql: false,
        mysql2: false,
        oracledb: false,
        'pg-query-stream': false,
        'sql.js': false,
        'typeorm-aurora-data-api-driver': false,
      };
    }

    config.externals = config.externals || [];
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
      encoding: 'commonjs encoding',
      'react-native-sqlite-storage': 'commonjs react-native-sqlite-storage',
      '@sap/hana-client/extension/Stream':
        'commonjs @sap/hana-client/extension/Stream',
      mysql: 'commonjs mysql',
    });

    config.module = config.module || {};
    config.module.unknownContextCritical = false;
    config.module.exprContextCritical = false;

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
  transpilePackages: [
    '@ionic/react',
    '@ionic/core',
    '@stencil/core',
    'ionicons',
  ],
};
