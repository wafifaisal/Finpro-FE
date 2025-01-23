// import Footer from "@/components/footer/footer";
import Navbar from "@/components/main/navbar/Navbar";
import { ReactNode } from "react";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
      {/* <Footer /> */}
    </div>
  );
}
