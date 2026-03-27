import type { Metadata } from "next";
import "./globals.css";
import AppWalletProvider from "../components/AppWalletProvider";


export const metadata: Metadata = {
  title: "Solana To-Do List",
  description: "Created with Anchor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      <body>
        <AppWalletProvider>{children}</AppWalletProvider>
      </body>
    </html>
  );
}