import React, { useEffect, useState } from "react";
import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "pages/Home";
import Upload from "pages/document/Upload";
import Login from "pages/auth/Login";
import Register from "pages/auth/Register";
import { Toaster } from "react-hot-toast";
import { useStore } from "@utils/store";
import ViewDocument from "pages/document/id";
import SpinFC from "antd/lib/spin";
import AutomateDocument from "pages/document/Automate";

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
  {
    path: "/document/upload",
    element: <Upload />,
  },
  {
    path: "/document/:id",
    element: <ViewDocument />,
  },
  {
    path: "/document/automate/:id",
    element: <AutomateDocument />,
  },
]);

function App() {
  const { getProfile } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  async function getUserProfile() {
    await getProfile();
    setIsLoading(false);
  }

  useEffect(() => {
    getUserProfile();
  }, []);

  if (isLoading)
    return (
      <div className="h-screen grid place-content-center">
        <SpinFC size="large" />
      </div>
    );

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
