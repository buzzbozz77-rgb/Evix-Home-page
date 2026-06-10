export const metadata = {
  title: "Evix — AI-Powered Web Agency",
  description: "Build high-converting websites, landing pages, and AI chatbots. Powered by AI.",
};

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#04060f" }}>
        {children}
      </body>
    </html>
  );
}