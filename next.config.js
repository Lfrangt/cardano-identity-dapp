/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'api.dicebear.com'],
  },
  webpack: (config, { isServer }) => {
    // 为 WASM 添加支持
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      syncWebAssembly: true,
    }

    // 处理 WASM 文件
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    })

    // 处理 Cardano 序列化库
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    return config
  },
}

module.exports = nextConfig