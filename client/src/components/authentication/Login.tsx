import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AppRoutes } from "../../utilities/Routes";

interface Credentials {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        credentials
      );

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("user", JSON.stringify(data));
        navigate(AppRoutes.CALENDAR);
      } else {
        setError("Wrong email or password. Please try again.");
      }
    } catch (error) {
      setError("Wrong email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white shadow-lg rounded-2xl px-10 py-10 w-[400px] text-center">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          Welcome Back 👋
        </h1>
        <p className="text-gray-500 mb-6">
          Log in to continue to <span className="text-blue-600 font-semibold">GatherTime</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-left">
            <label htmlFor="email" className="text-gray-700 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg mt-1 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="text-left">
            <label htmlFor="password" className="text-gray-700 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg mt-1 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center mt-2">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-2 mt-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to={AppRoutes.SIGN_UP}
            className="text-purple-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
