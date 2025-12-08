import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { appRoutes } from "../../routes";

export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  const email = searchParams.get("email") || "";
  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";
  const password = searchParams.get("password") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await axios.post(`/auth/verify-code-and-register`, {
        email,
        firstName,
        lastName,
        password,
        code,
      });

      navigate(appRoutes.auth.login);
    } catch (_err) {
      setError("Neteisingas arba pasibaigęs kodas");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Patvirtinkite savo e. paštą
      </h2>

      <p className="text-center text-gray-600 mb-4">
        Patvirtinimo kodas buvo nusiųstas į
        <br />
        <span className="font-medium">{email}</span>
      </p>

      <form onSubmit={handleVerify} className="space-y-4">
        <input
          type="text"
          placeholder="Įveskite patvirtinimo kodą"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-indigo-600 text-white rounded-lg"
        >
          {isSubmitting ? "Tvirtinama..." : "Patvirtinti"}
        </button>
      </form>
    </div>
  );
}
