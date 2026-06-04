import Link from 'next/link';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <div className="min-h-screen pt-48 pb-32 px-6 flex flex-col items-center justify-center text-center bg-surface">
      <p className="font-label text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-6">Error 404</p>
      <h1 className="serif-headline text-5xl md:text-7xl italic tracking-tighter text-zinc-950 mb-8">
        Page not found
      </h1>
      <p className="text-zinc-500 font-light max-w-md mb-12">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/shop"
        className="border border-zinc-300 text-zinc-800 px-12 py-4 font-label text-[10px] uppercase tracking-widest hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all duration-500"
      >
        Back to Collection
      </Link>
    </div>
  );
}
