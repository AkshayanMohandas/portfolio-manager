import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio Manager — Unwritten",
  description: "Climate risk portfolio management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <MantineProvider
          defaultColorScheme="light"
          theme={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
            primaryColor: "blue",
            colors: {},
            components: {
              Table: {
                styles: {
                  root: {
                    fontSize: 13,
                  },
                },
              },
            },
          }}
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
