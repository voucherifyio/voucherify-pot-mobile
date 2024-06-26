/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'dev.dl.voucherify.io',
            },
            {
                protocol: 'https',
                hostname: 'dl.voucherify.io',
            },
        ],
    },
}

module.exports = nextConfig
