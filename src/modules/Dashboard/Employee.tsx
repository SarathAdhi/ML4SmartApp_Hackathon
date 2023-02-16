import { filterDoc } from "@backend/lib";
import { useStore } from "@utils/store";
import { where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Document } from "types/document";

const Employee = () => {
  const { user } = useStore();
  const [companyDocuments, setCompanyDocuments] = useState<Document[]>([]);

  async function getCompanyDocuments() {
    const data = await filterDoc(
      "document",
      where("companyId", "==", user?.companyId)
    );

    setCompanyDocuments(data);
  }

  useEffect(() => {
    getCompanyDocuments();
  }, []);

  console.log({ companyDocuments });

  return (
    <div>
      {companyDocuments.map((doc) => (
        <Link to={`/document/${doc.uuid}`}>{doc.name}</Link>
      ))}
    </div>
  );
};

export default Employee;
