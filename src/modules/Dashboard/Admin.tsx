import { filterDoc } from "@backend/lib";
import CompanyDocumentCard from "@components/CompanyDocumentCard";
import { useStore } from "@utils/store";
import { where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Document } from "types/document";

const Admin = () => {
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
    <div className="grid">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 place-content-center">
        {companyDocuments.map((doc) => (
          <CompanyDocumentCard
            key={doc.uuid}
            getCompanyDocuments={getCompanyDocuments}
            {...doc}
          />
        ))}
      </div>
    </div>
  );
};

export default Admin;
