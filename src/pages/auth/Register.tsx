import PageLayout from "@layouts/PageLayout";
import Input from "antd/lib/input";
import { useEffect, useState } from "react";
import { Button, Form, Switch } from "antd";
import { addDoc, filterDoc } from "@backend/lib";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import { useStore } from "@utils/store";
import { Link, useNavigate } from "react-router-dom";
import { where } from "firebase/firestore";

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
      const emailExist = await filterDoc(
        "user",
        where("email", "==", formDetails.email)
      );

      if (emailExist.length !== 0) {
        toast.error("Email already exist");
        return;
      }

      const companyIdExist = await filterDoc(
        "user",
        where("companyId", "==", formDetails.companyId)
      );

      if (companyIdExist.length === 0) {
        toast.error("Company ID doesn't exist");
        return;
      }

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
    <PageLayout className="flex items-center justify-center flex-col gap-5">
      <div className="flex flex-col items-center text-center">
        <img src="/logo.svg" className="w-20 h-20" />
        <h1 className="font-bold">Create a new account</h1>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="bg-white rounded-md p-5 grid place-items-center w-full md:w-[500px]"
      >
        <div className="flex items-center gap-5 mb-5">
          <h3 className={!formDetails.isAdmin ? "font-bold" : "font-normal"}>
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

          <h3 className={formDetails.isAdmin ? "font-bold" : "font-normal"}>
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

        <Button
          htmlType="submit"
          size="large"
          className="w-full font-semibold bg-green-600 !text-white"
        >
          Register
        </Button>

        <Link to="/auth/login" className="mt-2 text-blue-500 hover:underline">
          Already have an account? Login
        </Link>
      </Form>
    </PageLayout>
  );
}

export default Register;
