import React, { useEffect } from "react";
import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "pages/Home";
import Login from "pages/auth/Login";
import Register from "pages/auth/Register";
import { Toaster } from "react-hot-toast";
import { useStore } from "@utils/store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/register",
    element: <Register />,
  },
]);

function App() {
  const { getProfile } = useStore();

  async function getUserProfile() {
    await getProfile();
  }

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
