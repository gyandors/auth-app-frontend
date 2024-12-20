import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import useAuth from "../context/auth-context";
import Toaster from "./ui/Toaster";

export default function Home() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });
  const { user, jwt } = useAuth();
  const [qrCode, setQrCode] = useState(null);
  const [code, setCode] = useState("");
  const [toaster, setToaster] = useState({
    title: "",
    message: "",
  });

  const handleEnable2FA = async () => {
    setIsUpdating(false);

    if (!window.confirm("Are you sure want to enable 2FA?")) return;

    const response = await fetch("http://localhost:8000/api/user/setup-2fa/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt.access}`,
      },
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      setToaster({
        title: "Error",
        message: data.message,
      });
      return;
    }

    setQrCode(data.provisioning_uri);
  };

  const handleVerifyCode = async () => {
    const response = await fetch("http://localhost:8000/api/user/setup-2fa/", {
      method: "PUT",
      body: JSON.stringify({ otp: code }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt.access}`,
      },
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      return;
    }

    setQrCode(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log(formData);
    setIsUpdating(false);
  };

  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold">
        Welcome, {user.first_name || "User"}
      </h1>
      <div className="flex justify-center gap-4 my-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleEnable2FA}
        >
          Enable 2FA
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => setIsUpdating(true)}
        >
          Update Profile
        </button>
      </div>
      {qrCode && (
        <div className="flex flex-col items-center gap-4 border border-gray-300 rounded-md p-4">
          <QRCodeSVG value={qrCode} />
          <p>
            Scan the QR code with your authenticator app then enter the code
            below
          </p>
          <input
            className="border border-gray-300 rounded-md p-2"
            type="text"
            placeholder="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleVerifyCode}
          >
            Verify
          </button>
        </div>
      )}
      {isUpdating && (
        <form className="mt-4 space-x-4" onSubmit={handleUpdate}>
          <input
            className="border border-gray-300 rounded-md p-2"
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          <input
            className="border border-gray-300 rounded-md p-2"
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Update
          </button>
        </form>
      )}
      {toaster.title && (
        <Toaster
          title={toaster.title}
          message={toaster.message}
          onClose={() => setToaster({ title: "", message: "" })}
        />
      )}
    </main>
  );
}
