import Image from "next/image";
import "./global.css";
import { Roboto } from "next/font/google";
import Header from "@/components/Header/Header";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={roboto.className}>
        <div className="page__wrapper">
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
