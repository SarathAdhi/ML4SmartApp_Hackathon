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
import { Button, Upload, UploadProps } from "antd";
import withAuth from "@hoc/withAuth";
import readXlsxFile from "read-excel-file";
import type { Row } from "read-excel-file";
import SpinFC from "antd/lib/spin";
import { toast } from "react-hot-toast";

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

const AuutomateDocument = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [companyDocument, setCompanyDocument] = useState<Document | null>(null);
  const [excelRows, setExcelRows] = useState<Row[]>([]);

  const params = useParams();

  const id = params?.id || "";

  const { user } = useStore();

  async function getCompanyDocument() {
    const data = await filterDoc("document", where("uuid", "==", id));

    setCompanyDocument(data[0]);

    setIsLoading(false);
  }

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

  const { fileLink, name } = companyDocument;

  const generateDocument = () => {
    if (excelRows.length === 0) {
      toast.error("Upload an Excel file");
      return;
    }

    loadFile(fileLink, function (error: Error, content: string) {
      if (error) {
        throw error;
      }

      const headerNames = excelRows[0];

      excelRows.map((rows, index) => {
        if (index === 0) return;

        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });

        let newObj = {} as any;
        rows.map((e, i) => {
          newObj[headerNames[i] as string] = e;
        });

        console.log({ newObj });

        console.log({ newObj });

        doc.setData(newObj);

        try {
          doc.render();
        } catch (error) {}

        const out = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        saveAs(out, `${name + "-" + index}.docx`);
      });
    });
  };

  async function readExcelFile(e: File) {
    readXlsxFile(e).then((rows) => {
      setExcelRows(rows);
    });
  }

  const uploadButtonProps: UploadProps = {
    action: undefined,
    maxCount: 1,
    onChange(info) {
      readExcelFile(info.file.originFileObj!);
    },
  };

  return (
    <PageLayout className="flex flex-col items-start">
      <Upload {...uploadButtonProps} className="grid">
        <Button
          size="large"
          className="w-full font-semibold bg-blue-600 !text-white"
        >
          Click to Upload
        </Button>
      </Upload>

      <Button size="large" onClick={generateDocument}>
        Download
      </Button>
    </PageLayout>
  );
};

export default withAuth(AuutomateDocument, false);
