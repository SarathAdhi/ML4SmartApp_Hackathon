import { delDoc } from "@backend/lib";
import { useStore } from "@utils/store";
import { Popconfirm } from "antd";
import Button from "antd/lib/button";
import Card from "antd/lib/card";
import React from "react";
import { Link } from "react-router-dom";
import { Document } from "types/document";

type Props = {
  getCompanyDocuments?: () => void;
} & Document;

async function handleDocumentDelete(id: string, filePath?: string) {
  await delDoc("document", id, filePath);
}

const CompanyDocumentCard: React.FC<Props> = ({
  id,
  name,
  companyId,
  filePath,
  uuid,
  fileLink,
  getCompanyDocuments,
}) => {
  const { isAdmin } = useStore();

  const actions = [
    isAdmin && (
      <Popconfirm
        title="Delete the Document"
        description="Are you sure to delete this document?"
        onConfirm={() => {
          handleDocumentDelete(id, filePath).then((e) => {
            getCompanyDocuments?.();
          });
        }}
        okText="Yes"
        okButtonProps={{
          type: "dashed",
        }}
        cancelText="No"
      >
        <Button type="text">Delete</Button>
      </Popconfirm>
    ),
    isAdmin && (
      <Link to={`/document/automate/${uuid}`} className="p-1 !text-blue-500">
        Automate
      </Link>
    ),
    <Link to={`/document/${uuid}`} className="p-1 !text-blue-500">
      View
    </Link>,
  ].filter((e) => e);

  return (
    <Card actions={actions}>
      <h2>{name}</h2>
      <p className="text-base text-gray-500">{`Company ID: ${companyId}`}</p>
    </Card>
  );
};

export default CompanyDocumentCard;
