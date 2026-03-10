import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TelltaleProof — AI vs Human Content Detector",
  description: "Analyze any text across 30+ signals to determine if it was written by AI or a human. Deep scoring across structure, voice, cognitive fingerprinting, and more.",
  keywords: ["AI content detector", "AI writing detector", "human vs AI text", "GPT detector", "content authenticity", "TelltaleProof"],
  openGraph: {
    title: "TelltaleProof — AI vs Human Content Detector",
    description: "Deep, explainable AI content analysis across 30+ signals. Prove your content is human.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
