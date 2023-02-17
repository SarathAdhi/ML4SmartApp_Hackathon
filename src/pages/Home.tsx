import withAuth from "@hoc/withAuth";
import PageLayout from "@layouts/PageLayout";
import Admin from "@modules/Dashboard/Admin";
import Employee from "@modules/Dashboard/Employee";
import { useStore } from "@utils/store";
import React from "react";

function Home() {
  const { isAdmin } = useStore();

  return <PageLayout>{isAdmin ? <Admin /> : <Employee />}</PageLayout>;
}

export default withAuth(Home, false);
