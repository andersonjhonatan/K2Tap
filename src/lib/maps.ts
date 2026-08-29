import type { ProjectConfig } from '@/types/project'

export type MapUrls = {
  /** Abre o Google Maps com a busca do endereço. */
  mapsUrl: string
  /** Versão embutível, usada no iframe do mapa. */
  mapEmbedUrl: string
}

export function getMapUrls(location: ProjectConfig['location']): MapUrls {
  const query = encodeURIComponent(location.mapQuery)
  return {
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${query}`,
    mapEmbedUrl: `https://www.google.com/maps?q=${query}&output=embed`,
  }
}
