import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'localhost',
            'dev-admin.sanmartinbakery.com',
            'stage-admin.sanmartinbakery.com',
        ],
        localPatterns: [
            {
                pathname: '/public/**',
                search: '',
            },
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'san-martin-images-app.sanmartinbakery.com',
                pathname: '**',
                port: '',
                search: '',
            },
        ],
    },
}

export default withNextIntl(nextConfig)
