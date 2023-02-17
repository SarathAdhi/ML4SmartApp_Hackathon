import { filterDoc } from "@backend/lib";
import PageLayout from "@layouts/PageLayout";
import { useStore } from "@utils/store";
import { where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Document } from "types/document";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils";
import { saveAs } from "file-saver";
import { Button, Form, Input } from "antd";
import withAuth from "@hoc/withAuth";
import SpinFC from "antd/lib/spin";

interface LoadFileProps {
  url: string;
  callback: (error: Error, data: string) => void;
}

function loadFile(
  url: LoadFileProps["url"],
  callback: LoadFileProps["callback"]
) {
  PizZipUtils.getBinaryContent(url, callback);
}

const ViewDocument = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [companyDocument, setCompanyDocument] = useState<Document | null>(null);
  const [documentAttributeData, setDocumentAttributeData] = useState({});

  const params = useParams();

  const id = params?.id || "";

  const { user } = useStore();
  const [form] = Form.useForm();

  async function getCompanyDocument() {
    const data = await filterDoc("document", where("uuid", "==", id));

    setCompanyDocument(data[0]);

    setIsLoading(false);
  }

  console.log({ companyDocument });

  useEffect(() => {
    if (id) getCompanyDocument();
  }, [id]);

  if (isLoading)
    return (
      <div className="h-screen grid place-content-center">
        <SpinFC size="large" />
      </div>
    );

  if (!companyDocument)
    return <h3 className="text-center">Document not found</h3>;

  if (user && companyDocument.companyId !== user?.companyId)
    return <h3>You doesn't belong to this company</h3>;

  const { fileLink, attributes, name } = companyDocument;

  const generateDocument = () => {
    loadFile(fileLink, function (error: Error, content: string) {
      if (error) {
        throw error;
      }

      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      doc.setData(documentAttributeData);

      try {
        doc.render();
      } catch (error) {}

      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      saveAs(out, `${name}.docx`);
    });
  };

  const attributesArray = attributes && Object.entries(attributes);
  // console.log({ documentAttributeData });

  return (
    <PageLayout>
      <Form
        form={form}
        layout="vertical"
        onFinish={generateDocument}
        className="bg-white rounded-md p-5 grid place-items-start grid-cols-1 md:grid-cols-2 gap-5 w-full"
      >
        {attributesArray.map((attribute) => (
          <Form.Item
            key={attribute[0]}
            label={attribute[0]}
            name={attribute[0]}
            rules={[
              {
                required: true,
                message: `Please input your varible ${attribute[0]}!`,
              },
            ]}
          >
            <Input
              placeholder={`Enter your variable ${attribute[0]}`}
              type={attribute[1] as string}
              onChange={(e) =>
                setDocumentAttributeData({
                  ...documentAttributeData,
                  [attribute[0]]: e.target.value,
                })
              }
            />
          </Form.Item>
        ))}

        <Button
          htmlType="submit"
          size="large"
          className="font-semibold bg-blue-600 !text-white"
        >
          Download Document
        </Button>
      </Form>
    </PageLayout>
  );
};

export default withAuth(ViewDocument, false);
