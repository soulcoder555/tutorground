import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { MobileSidebar } from "@/components/layout/MobileSidebar";

export const metadata: Metadata = {
  title: "TutorGround",
  description: "Trusted local tutoring ecosystem for tutors, students, and parents.",
  metadataBase: new URL("https://tutorground.example.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <MobileSidebar />
        {children}
      </body>
    </html>
  );
}

