import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Xavier Tech Byte Society',
    short_name: 'XTS Portal',
    description: 'The official member portal for Xavier Tech Byte Society — XTS.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F4F5FA',
    theme_color: '#0F1226',
    categories: ['education', 'productivity'],
    icons: [
      {
        src: '/icon-2.jpeg',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'maskable',
      },
      {
        src: '/icon.jpeg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'any',
      },
    ],
    screenshots: [],
  };
}
