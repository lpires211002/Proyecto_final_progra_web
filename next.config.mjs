/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow next/image to optimize remote images from these hosts.
    // If a product image lives on another domain, add its hostname here.
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
    ],
  },
};

export default nextConfig;
