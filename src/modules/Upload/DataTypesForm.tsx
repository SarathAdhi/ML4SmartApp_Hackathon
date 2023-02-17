import { updateDoc } from "@backend/lib";
import { FORM_DATA_TYPES } from "@utils/constants";
import { Select } from "antd";
import Button from "antd/lib/button";
import Form from "antd/lib/Form";
import React from "react";
import { toast } from "react-hot-toast";
import { Document } from "types/document";

type Props = {
  attributesDataTypes: {};
  documentId: Document["uuid"];
  attributesName: string[];
  handleSelectChange: (key: string, values: string) => void;
  handleSubmitCallBack: () => void;
};

const DataTypesForm: React.FC<Props> = ({
  attributesDataTypes,
  documentId,
  attributesName,
  handleSelectChange,
  handleSubmitCallBack,
}) => {
  const [form] = Form.useForm();

  async function handleSubmit() {
    await updateDoc("document", documentId, {
      attributes: attributesDataTypes,
    });

    toast.success("Document and Data types uploaded successfully");

    handleSubmitCallBack();
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={attributesDataTypes}
      className="bg-white rounded-md p-5 grid place-items-start grid-cols-1 md:grid-cols-2 gap-5 w-full"
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
            size="large"
            onChange={(e) => handleSelectChange(data, e)}
            options={FORM_DATA_TYPES}
          />
        </Form.Item>
      ))}

      <Button
        size="large"
        className="w-auto font-semibold bg-green-600 !text-white"
        htmlType="submit"
      >
        Submit
      </Button>
    </Form>
  );
};

export default DataTypesForm;
