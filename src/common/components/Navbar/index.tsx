import { useStore } from "@utils/store";
import React from "react";
import { Link } from "react-router-dom";
import { pages } from "./page";
import Button from "antd/lib/button";

const Navbar = () => {
  const { user, logout } = useStore();

  return (
    <header className="p-2 sm:p-5 w-full flex flex-col items-center bg-slate-300 border-b">
      <div className="max-w-full w-[1280px] flex items-center">
        {pages.map((page) => (
          <Link to={page.to} key={page.name}>
            {page.name}
          </Link>
        ))}

        {user ? (
          <Button danger onClick={logout}>
            Logout
          </Button>
        ) : (
          <Link to="/auth/login">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
