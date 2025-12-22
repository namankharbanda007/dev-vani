import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'SMART मूर्ति',
        short_name: 'SmartMurti',
        description: "World's First Devotional Ecosystem - AI-powered conversations with your Murti",
        start_url: '/',
        display: 'standalone',
        background_color: '#FFF8E7',
        theme_color: '#f97316',
        orientation: 'portrait',
        icons: [
            {
                src: '/icons/icon-192x192.jpg',
                sizes: '192x192',
                type: 'image/jpeg',
            },
            {
                src: '/icons/icon-512x512.jpg',
                sizes: '512x512',
                type: 'image/jpeg',
            },
            {
                src: '/apple-touch-icon.png',
                sizes: '180x180',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    }
}

