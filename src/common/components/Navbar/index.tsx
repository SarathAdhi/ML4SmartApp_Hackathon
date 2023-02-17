import { useStore } from "@utils/store";
import React from "react";
import { Link } from "react-router-dom";
import { pages } from "./page";
import Button from "antd/lib/button";

const Navbar = () => {
  const { user, logout, isAdmin } = useStore();

  return (
    <header className="p-3 w-full flex flex-col items-center bg-slate-200 border-b">
      <div className="max-w-full w-[1280px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" className="w-10 h-10" />
          <p className="font-bold">DOCXTER</p>
        </Link>

        <div className="flex items-center gap-5 font-bold">
          {user &&
            pages.map((page) => {
              if (page.adminRoute && page.adminRoute !== isAdmin) return;

              return (
                <Link to={page.to} key={page.name}>
                  {page.name}
                </Link>
              );
            })}

          {user ? (
            <Button danger onClick={logout} className="font-bold">
              Logout
            </Button>
          ) : (
            <Link
              to="/auth/login"
              className="bg-green-600 text-white px-4 py-1 rounded-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
