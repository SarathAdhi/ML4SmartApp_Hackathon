import PageLayout from "@layouts/PageLayout";
import Input from "antd/lib/input";
import Form from "antd/lib/Form";
import Switch from "antd/lib/Switch";
import { useEffect, useState } from "react";
import { Button } from "antd";
import { addDoc } from "@backend/lib";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import { useStore } from "@utils/store";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form] = Form.useForm();

  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    password: "",
    companyId: "",
    isAdmin: false,
  });

  const { user, getProfile } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const handleSubmit = async () => {
    const uuid = uuidv4();

    try {
      await addDoc("user", {
        uuid,
        ...formDetails,
      });

      localStorage.setItem("token", uuid);
      getProfile();

      toast.success("Account created successfully");
    } catch (error) {
      toast.success("Smething went wrong");
    }
  };

  return (
    <PageLayout>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="flex items-center gap-5 mb-5">
          <h3
            className={!formDetails.isAdmin ? "font-semibold" : "font-normal"}
          >
            Employee
          </h3>

          <Switch
            onChange={(value) =>
              setFormDetails({
                ...formDetails,
                isAdmin: value,
              })
            }
          />

          <h3 className={formDetails.isAdmin ? "font-semibold" : "font-normal"}>
            Admin
          </h3>
        </div>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input
            placeholder="Enter your Name"
            onChange={(e) =>
              setFormDetails({
                ...formDetails,
                name: e.target.value,
              })
            }
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            type="email"
            placeholder="Enter your Email"
            onChange={(e) =>
              setFormDetails({
                ...formDetails,
                email: e.target.value,
              })
            }
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            placeholder="Enter your Password"
            onChange={(e) =>
              setFormDetails({
                ...formDetails,
                password: e.target.value,
              })
            }
          />
        </Form.Item>

        <Form.Item
          label="Company ID"
          name="companyId"
          rules={[{ required: true, message: "Please input your company id!" }]}
        >
          <Input
            placeholder="Enter your Company ID"
            onChange={(e) =>
              setFormDetails({
                ...formDetails,
                companyId: e.target.value,
              })
            }
          />
        </Form.Item>

        <Button htmlType="submit">Register</Button>
      </Form>
    </PageLayout>
  );
}

export default Register;
