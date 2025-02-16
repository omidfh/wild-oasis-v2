import React from "react";
import Navigation from "./_components/Navigation old";
import Logo from "./_components/Logo";

import "@/app/_styles/globals.css";

import { Josefin_Sans } from "next/font/google";
import Header from "./_components/Header";
import { ReservationProvider } from "./_components/ReservationContext";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});
console.log(josefin);

export const metadata = {
  // title: "Wild Oasis",
  title: {
    template: "%s The Wild Oasis",
    default: "Welcome /  The Wild Oasis",
  },
  description:
    "Luxurious Cabin Hotel located in the heart of Italian Dolomites mountains",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body
        className={`${josefin.className} antialiased bg-primary-950 text-primary-100 min-h-screen flex flex-col`}
      >
        <Header />
        <div className="flex-1 px-8 py-12 grid">
          <main className="mx-auto  w-full">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
