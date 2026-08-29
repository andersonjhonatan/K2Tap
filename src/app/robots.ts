import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    // As demonstrações por projeto são públicas; telas operacionais de mesa e
    // de equipe existem para uso ao vivo e não devem aparecer na busca.
    rules: { userAgent: '*', allow: '/', disallow: ['/garcom', '/demo/mesa/'] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}
