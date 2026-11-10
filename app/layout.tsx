import type { Metadata } from "next";
import "../styles/tokens/colors.css";
import "../styles/tokens/semantic.css";
import "../styles/tokens/typography.css";
import "../styles/tokens/spacing.css";
import "../styles/tokens/effects.css";
import "../styles/tokens/base.css";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "HealthyAI",
  description: "Diagnostic assistant for healthcare professionals",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
