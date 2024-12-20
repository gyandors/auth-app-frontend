import { useState } from "react";

import useAuth from "../context/auth-context";
import Toaster from "./ui/Toaster";

export default function AuthForm({ mode = "register" }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const { login } = useAuth();

  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [otp, setOtp] = useState("");
  const [invalidOtp, setInvalidOtp] = useState(false);
  const [toaster, setToaster] = useState({
    title: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint =
      mode === "register"
        ? "http://localhost:8000/api/user/register/"
        : "http://localhost:8000/api/user/login/";

    const body =
      mode === "register"
        ? {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            password: formData.password,
          }
        : {
            email: formData.email,
            password: formData.password,
          };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      setToaster({
        title: "Error",
        message: data.message,
      });
    }

    if (mode === "register" && response.ok) {
      setToaster({
        title: "Success",
        message: "User registered successfully",
      });
    }

    if (mode === "login" && response.ok) {
      if (data.user.is_2fa_enabled) {
        setIs2faEnabled(true);
      } else {
        login(data);
      }
    }
  };

  const handleVerify = async () => {
    const response = await fetch("http://localhost:8000/api/user/verify-2fa/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp: otp, email: formData.email }),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      login(data);
    } else {
      setInvalidOtp(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {!is2faEnabled ? (
            <span>{mode === "register" ? "Register" : "Login"}</span>
          ) : (
            <span>Enter OTP</span>
          )}
        </h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            {mode === "register" && (
              <>
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </>
            )}
            {!is2faEnabled && (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </>
            )}
          </div>

          {!is2faEnabled && (
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {mode === "register" ? "Register" : "Login"}
            </button>
          )}

          {is2faEnabled && (
            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setInvalidOtp(false);
                }}
                placeholder="OTP"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              {invalidOtp && (
                <p className="text-red-500 text-sm">Invalid OTP</p>
              )}
              <button
                onClick={handleVerify}
                type="button"
                className="mt-2 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Verify
              </button>
            </div>
          )}
        </form>
      </div>
      {toaster.title && (
        <Toaster
          title={toaster.title}
          message={toaster.message}
          onClose={() => setToaster({ title: "", message: "" })}
        />
      )}
    </div>
  );
}
