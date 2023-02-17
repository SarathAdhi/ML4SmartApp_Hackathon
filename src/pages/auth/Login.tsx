import PageLayout from "@layouts/PageLayout";
import Input from "antd/lib/input";
import Form from "antd/lib/Form";
import { useEffect, useState } from "react";
import { Button } from "antd";
import { filterDoc } from "@backend/lib";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { where } from "firebase/firestore";
import { useStore } from "@utils/store";

function Login() {
  const [form] = Form.useForm();

  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
  });

  const { user, getProfile } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const handleSubmit = async () => {
    const { email, password } = formDetails;

    try {
      const res = await filterDoc("user", where("email", "==", email));

      if (res.length === 0) {
        toast.error("Email doesn't exist");
        return;
      }

      const user = res[0];
      if (password !== user.password) {
        toast.error("Invalid password");
        return;
      }

      localStorage.setItem("token", user.uuid);
      getProfile();

      toast.success("Login successful");
    } catch (error) {
      toast.success("Smething went wrong");
    }
  };

  return (
    <PageLayout className="flex items-center justify-center flex-col gap-5">
      <div className="flex flex-col items-center text-center">
        <img src="/logo.svg" className="w-20 h-20" />
        <h1 className="font-bold">Sign in to your account</h1>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="bg-white rounded-md p-5 grid place-items-center w-full md:w-[500px]"
      >
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

        <Button
          htmlType="submit"
          size="large"
          className="w-full font-semibold bg-green-600 !text-white"
        >
          Login
        </Button>

        <Link
          to="/auth/register"
          className="mt-2 text-blue-500 hover:underline"
        >
          Create an account
        </Link>
      </Form>
    </PageLayout>
  );
}

export default Login;
