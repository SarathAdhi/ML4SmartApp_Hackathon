import { useStore } from "@utils/store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const withAuth = (Component: React.FC, checkAdmin = true) =>
  function pageProp({ ...pageProps }) {
    const { user, isAdmin } = useStore();
    const navigate = useNavigate();

    const isAuth = !!user;

    useEffect(() => {
      if (!isAuth) {
        navigate("/auth/login");
      }

      if (checkAdmin && !isAdmin) {
        navigate("/");
      }
    }, [user]);

    return <Component {...pageProps} />;
  };

withAuth.displayName = "withAuth";
export default withAuth;
