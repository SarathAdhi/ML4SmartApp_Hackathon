import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils";
import PageLayout from "@layouts/PageLayout";
import { Button, Upload, Form, Select, Modal, Input } from "antd";
import type { UploadProps, UploadFile } from "antd";
import { useState } from "react";
import { addDoc, fileUpload, updateDoc } from "@backend/lib";
import { v4 } from "uuid";
import { useStore } from "@utils/store";
import { toast } from "react-hot-toast";
import { getDownloadURL } from "firebase/storage";
import withAuth from "@hoc/withAuth";

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

function UploadPage() {
  const [file, setFile] = useState<UploadFile | null>();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [attributesName, setAttributesName] = useState<string[]>([]);
  const [attributesDataTypes, setAttributesDataTypes] = useState({});

  const [form] = Form.useForm();

  const { user } = useStore();

  function generateDataTypesForm() {
    if (!fileUrl) return;

    loadFile(fileUrl, function (error: Error, content: string) {
      if (error) throw error;

      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      const text = doc.getFullText();
      const regx = /{([^}]+)}/g;

      const attributesName = text.match(regx) as string[];

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
    setIsConfirmationModalOpen(false);

    if (!file) return;

    const fileExtName = file.name.split(".")[1];

    const uuid = v4();

    const filePath = `${user?.companyId}/${uuid}.${fileExtName}`;

    try {
      const { ref } = await fileUpload(filePath, file);

      const fileLink = await getDownloadURL(ref);

      setFileUrl(fileLink);

      const res = await addDoc("document", {
        fileName: `${uuid}.${fileExtName}`,
        filePath,
        fileLink,
        uuid,
        companyId: user?.companyId,
        name: documentName,
      });

      setDocumentId(res.id);
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  async function handleSubmit() {
    console.log({ documentId });
    await updateDoc("document", documentId, {
      attributes: attributesDataTypes,
    });

    setAttributesDataTypes({});
    setAttributesName([]);
  }

  const uploadButtonProps: UploadProps = {
    action: undefined,
    maxCount: 1,
    onChange(info) {
      setFile(info.file.originFileObj);
      setIsConfirmationModalOpen(true);
    },
  };

  return (
    <PageLayout>
      <Upload {...uploadButtonProps}>
        <Button>Click to Upload</Button>
      </Upload>

      {fileUrl && (
        <Button onClick={generateDataTypesForm}>
          Generate Form for data types
        </Button>
      )}

      {attributesName && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={attributesDataTypes}
        >
          {attributesName.map((data, index) => (
            <Form.Item
              key={data + index}
              label={data.toUpperCase()}
              name={data}
              rules={[
                {
                  required: true,
                  message: `Please input your variable ${data}!`,
                },
              ]}
            >
              <Select
                style={{ width: 120 }}
                onChange={(e) =>
                  setAttributesDataTypes({
                    ...attributesDataTypes,
                    [data]: e,
                  })
                }
                options={[
                  { value: "string", label: "String" },
                  { value: "number", label: "Number" },
                  { value: "date", label: "Date" },
                ]}
              />
            </Form.Item>
          ))}

          <Button htmlType="submit">Submit</Button>
        </Form>
      )}

      <Modal
        title="Save & Upload Document"
        centered
        open={isConfirmationModalOpen}
        onOk={uploadDocument}
        onCancel={() => {
          setIsConfirmationModalOpen(false);
          setFile(null);
        }}
        okButtonProps={{
          type: "dashed",
          onClick: uploadDocument,
        }}
      >
        <Input
          placeholder="Enter a name for your Document"
          onChange={(e) => setDocumentName(e.target.value)}
        />
      </Modal>
    </PageLayout>
  );
}

export default withAuth(UploadPage);
