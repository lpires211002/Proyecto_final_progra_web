import "./globals.css";
import { Manrope, Noto_Serif } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import SearchSidebar from "@/components/SearchSidebar";
import AuthModal from "@/components/AuthModal";

// Fonts are loaded and self-hosted by Next.js (no layout shift, no extra round-trips).
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-noto-serif",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://proyecto-final-progra-web.vercel.app"),
  title: {
    default: "taiko nina | Atelier Collection",
    template: "%s | taiko nina",
  },
  description: "Defining modern femininity through precision and grace.",
  keywords: ["taiko nina", "atelier", "fashion", "minimalist", "luxury", "ecommerce"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "taiko nina | Atelier Collection",
    description: "Defining modern femininity through precision and grace.",
    url: "/",
    siteName: "taiko nina",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "taiko nina | Atelier Collection",
    description: "Defining modern femininity through precision and grace.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`light overflow-x-hidden ${manrope.variable} ${notoSerif.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface selection:bg-primary selection:text-on-primary font-body antialiased flex flex-col min-h-screen">
        <AppProvider>
          <Navbar />
          <CartSidebar />
          <SearchSidebar />
          <AuthModal />
          <main className="flex-1 flex flex-col pt-0">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
