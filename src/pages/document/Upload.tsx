import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils";
import PageLayout from "@layouts/PageLayout";
import { Button, Upload, Modal, Input } from "antd";
import type { UploadProps, UploadFile } from "antd";
import { useState } from "react";
import { addDoc, fileUpload } from "@backend/lib";
import { v4 } from "uuid";
import { useStore } from "@utils/store";
import { toast } from "react-hot-toast";
import { getDownloadURL } from "firebase/storage";
import withAuth from "@hoc/withAuth";
import DataTypesForm from "@modules/Upload/DataTypesForm";

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

const options = {
  paragraphLoop: true,
  linebreaks: true,
};

function UploadPage() {
  const [file, setFile] = useState<UploadFile | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [document, setDocument] = useState({
    name: "",
    id: "",
  });
  const [attributesName, setAttributesName] = useState<string[]>([]);
  const [attributesDataTypes, setAttributesDataTypes] = useState({});

  const { user } = useStore();

  function generateDataTypesForm() {
    if (!fileUrl) return;

    loadFile(fileUrl, function (error: Error, content: string) {
      if (error) throw error;

      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, options);

      const text = doc.getFullText();

      const regx = /{([^}]+)}/g;

      let attributesName = text.match(regx) as string[];

      attributesName = attributesName.map((e) => e.replace(/[\])}[{(]/g, ""));

      // const obj = dataTypes?.reduce((pre, cur) => ({ ...pre, [cur]: "" }), {});
      const initialValues = attributesName?.reduce(
        (pre, cur) => ({ ...pre, [cur]: "string" }),
        {}
      );

      setAttributesDataTypes(initialValues);

      setAttributesName(attributesName);
    });
  }

  async function uploadDocument() {
    setIsModalOpen(false);

    if (!file) return;

    const fileExtName = file.name.split(".")[1];

    const uuid = v4();

    const filePath = `${user?.companyId}/${uuid}.${fileExtName}`;

    try {
      const { ref } = await fileUpload(filePath, file);

      toast.success("File Uploaded successfully");

      const fileLink = await getDownloadURL(ref);

      setFileUrl(fileLink);

      const res = await addDoc("document", {
        fileName: `${uuid}.${fileExtName}`,
        filePath,
        fileLink,
        uuid,
        companyId: user?.companyId,
        name: document.name,
        attributes: {},
      });

      setDocument({
        ...document,
        id: res.id,
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  const uploadButtonProps: UploadProps = {
    action: undefined,
    maxCount: 1,
    onChange(info) {
      setFile(info.file.originFileObj);
      setIsModalOpen(true);
    },
  };

  return (
    <PageLayout className="flex flex-col items-center gap-5">
      <Upload {...uploadButtonProps} className="grid">
        <Button
          size="large"
          className="w-full font-semibold bg-blue-600 !text-white"
        >
          Click to Upload
        </Button>
      </Upload>

      {fileUrl && (
        <Button
          size="large"
          className="font-semibold bg-blue-600 !text-white"
          onClick={generateDataTypesForm}
        >
          Generate Form
        </Button>
      )}

      {attributesName.length !== 0 && (
        <DataTypesForm
          documentId={document.id}
          handleSelectChange={(key, value) =>
            setAttributesDataTypes({
              ...attributesDataTypes,
              [key]: value,
            })
          }
          handleSubmitCallBack={() => {
            setAttributesDataTypes({});
            setAttributesName([]);
          }}
          {...{ attributesDataTypes, attributesName }}
        />
      )}

      <Modal
        title="Save & Upload Document"
        centered
        open={isModalOpen}
        onOk={uploadDocument}
        onCancel={() => {
          setIsModalOpen(false);
          setFile(null);
          setFileUrl("");
        }}
        okButtonProps={{
          type: "dashed",
          onClick: uploadDocument,
        }}
      >
        <Input
          placeholder="Enter a name for your Document"
          onChange={(e) =>
            setDocument({
              ...document,
              name: e.target.value,
            })
          }
        />
      </Modal>
    </PageLayout>
  );
}

export default withAuth(UploadPage);
