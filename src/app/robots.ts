import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://lumenforge.co.uk' // Replace with your actual production domain

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/dashboard/',
                '/chat/',
                '/sandbox/',
                '/teacher/',
                '/onboarding/',
                '/api/'
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
