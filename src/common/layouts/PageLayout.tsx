import Navbar from "@components/Navbar";
import clsx from "clsx";
import React from "react";
import { Component } from "types/component";

const PageLayout: React.FC<Component> = ({ children, className }) => {
  return (
    <main className="min-h-screen flex flex-col items-center bg-slate-200">
      <Navbar />

      <div
        className={clsx("max-w-full w-[1280px] flex-1 p-2 sm:p-5", className)}
      >
        {children}
      </div>
    </main>
  );
};

export default PageLayout;
