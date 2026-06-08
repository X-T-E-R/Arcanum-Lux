import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arcanum - AI Tarot Reading",
  description:
    "Immersive AI-powered tarot readings with cinematic card animations and deep mystical interpretations.",
  openGraph: {
    title: "Arcanum - AI Tarot Reading",
    description: "Unveil your path through the ancient art of tarot, guided by AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&family=Source+Serif+4:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-[100dvh] antialiased">{children}</body>
    </html>
  );
}
