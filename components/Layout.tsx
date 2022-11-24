import * as React from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="grow bg-gray-200">
        <div className="container mx-auto grow px-2 my-20 ">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
