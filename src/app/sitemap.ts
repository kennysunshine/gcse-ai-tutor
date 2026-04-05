import { MetadataRoute } from 'next'
import guideData from '@/data/guideData.json'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://lumenforge.co.uk'

    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/support/privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/support/data-deletion`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        }
    ]

    // Generate Programmatic SEO Routes (75 routes)
    const pSEORoutes: MetadataRoute.Sitemap = []
    const subjects = Object.keys(guideData.subjects)
    const locations = Object.keys(guideData.locations)
    const levels = ['gcse', 'ks3', 'ks2']

    subjects.forEach((subject) => {
        locations.forEach((location) => {
            levels.forEach((level) => {
                pSEORoutes.push({
                    url: `${baseUrl}/guide/${subject}/${level}/${location}`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly' as const,
                    priority: 0.7,
                })
            })
        })
    })

    return [...staticRoutes, ...pSEORoutes]
}
