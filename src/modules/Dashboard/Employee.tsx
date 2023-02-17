import { filterDoc } from "@backend/lib";
import CompanyDocumentCard from "@components/CompanyDocumentCard";
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

  return (
    <div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 place-content-center">
        {companyDocuments.map((doc) => (
          <CompanyDocumentCard key={doc.uuid} {...doc} />
        ))}
      </div>
    </div>
  );
};

export default Employee;
