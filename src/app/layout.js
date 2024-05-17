import { Container } from "@mui/material";
import { SessionProvider } from "./context/SessionContext";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Badminton Pairing Randomizer",
  description: "Generate your badminton pairing here",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Container fixed maxWidth={"sm"}>
            {children}
          </Container>
        </SessionProvider>
      </body>
    </html>
  );
}
