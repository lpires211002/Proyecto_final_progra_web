const BASE_URL = 'https://proyecto-final-progra-web.vercel.app';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin',
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
