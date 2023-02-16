import PageLayout from "@layouts/PageLayout";
import Admin from "@modules/Dashboard/Admin";
import Employee from "@modules/Dashboard/Employee";
import { useStore } from "@utils/store";
import React from "react";

function Home() {
  const { isAdmin, user } = useStore();

  return (
    <PageLayout>
      {user ? isAdmin ? <Admin /> : <Employee /> : <p>Login</p>}
    </PageLayout>
  );
}

export default Home;
