import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import SearchSidebar from "@/components/SearchSidebar";
import AuthModal from "@/components/AuthModal";

export const metadata = {
  title: "taiko nina | Atelier Collection",
  description: "Defining modern femininity through precision and grace.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light overflow-x-hidden">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Manrope:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
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
