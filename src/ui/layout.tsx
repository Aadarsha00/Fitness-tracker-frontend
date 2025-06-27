"use client";
import React from "react";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header/page";
interface IProps {
  children: React.ReactNode;
}

const Layout: React.FC<IProps> = ({ children }) => {
  const pathName = usePathname();
  const hideNav = pathName === "/login" || pathName === "/signup";

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNav && <Header />}
      <main className="flex-grow mb-0">{children}</main>
    </div>
  );
};

export default Layout;
