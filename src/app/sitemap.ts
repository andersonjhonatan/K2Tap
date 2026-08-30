import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { projects } from '@/data/projects'

const lastModified = new Date('2026-08-28')

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/comprar`,
      lastModified: new Date('2026-08-29'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...projects.map((project) => ({
      url: `${siteConfig.url}/demo/${project.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
