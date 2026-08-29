import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DemoExperience } from '@/components/demo/DemoExperience'
import { siteConfig } from '@/config/site'
import { getProjectBySlug, projects } from '@/data/projects'

type DemoPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: DemoPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return { title: 'Demonstração não encontrada' }

  return {
    title: `${project.name} • demonstração`,
    description: `Demonstração da experiência ${siteConfig.name} para ${project.name}: ${project.experience.description}`,
    alternates: { canonical: `/demo/${project.slug}` },
    openGraph: {
      title: `${project.name} • demonstração ${siteConfig.name}`,
      description: project.experience.description,
      url: `/demo/${project.slug}`,
    },
  }
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  return <DemoExperience project={project} />
}
