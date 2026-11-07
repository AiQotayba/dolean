import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'تلاقي',
    short_name: 'تلاقي',
    description: 'منصة التدريب والتمكين المهني - حقق أهدافك التعليمية مع الدورات المصممة لك',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.png',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}