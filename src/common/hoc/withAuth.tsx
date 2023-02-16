import { useStore } from "@utils/store";
import React from "react";
import { useNavigate } from "react-router-dom";

const withAuth = (Component: React.FC) =>
  function pageProp({ ...pageProps }) {
    const { user } = useStore();
    const navigate = useNavigate();

    const isAuth = !!user;

    if (!isAuth) {
      navigate("/login");
      return;
    }

    return <Component {...pageProps} />;
  };

withAuth.displayName = "withAuth";
export default withAuth;
