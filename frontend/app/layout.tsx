import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk, Manrope, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { AuthModal } from "@/components/auth/AuthModal";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { Prefetcher } from "@/components/layout/Prefetcher";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display-loaded",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-head-loaded",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body-loaded",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kesey — Metin2 Privát Szerver",
  description: "Klasszikus Metin2 hardcore élmény, modern szerver-stabilitással. Season 4.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${bebasNeue.variable} ${spaceGrotesk.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NavigationProgress />
          <Prefetcher />
          <Header />
          <main style={{ position: "relative", zIndex: 2, minHeight: "calc(100dvh - var(--header-h))" }}>
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <AuthModal />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
