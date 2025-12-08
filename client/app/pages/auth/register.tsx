import axios from "axios";
import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { fetchUserByEmail } from "../../api/UserApi";
import { appRoutes } from "../../routes";
import { ErrorType } from "../../utilities/validations/ErrorType";
import { validatePasswords } from "../../utilities/validations/PasswordValidation";

interface Credentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

interface Err {
  message: string;
  errorType: ErrorType;
}

export default function Register() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState<Err>({
    message: "",
    errorType: ErrorType.NoError,
  });
  const [emailError, setEmailError] = useState<Err>({
    message: "",
    errorType: ErrorType.NoError,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(event);
    const validationError = validatePasswords(
      event.target.value,
      credentials.confirmPassword,
    );
    setError({ message: "", errorType: validationError });
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleInputChange(event);
    const validationError = validatePasswords(
      credentials.password,
      event.target.value,
    );
    setError({ message: "", errorType: validationError });
  };

  const handleCheckEmail = async (
    event: React.FocusEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;

    try {
      const user = await fetchUserByEmail(value);

      if (user !== null) {
        setEmailError({
          message: "E. paštas jau naudojamas",
          errorType: ErrorType.EmailRegistered,
        });
      } else {
        setEmailError({
          message: "",
          errorType: ErrorType.NoError,
        });
      }
    } catch (_error) {}
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting || error.errorType !== ErrorType.NoError) return;

    setIsSubmitting(true);
    setError({ message: "", errorType: ErrorType.NoError });

    try {
      await axios.post(`/auth/send-code`, {
        email: credentials.email,
      });

      const params = new URLSearchParams({
        email: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        password: credentials.password,
      });

      navigate(`${appRoutes.auth.verify}?${params.toString()}`);
    } catch (error) {
      console.error(error);
      setError({
        message: "Patvirtinimo kodas nebuvo išsiųstas",
        errorType: ErrorType.Other,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-semibold text-gray-800 mb-2">
          Sveiki atvykę į <span className="text-indigo-600">GatherTime?</span>
        </h1>
        <p className="text-gray-500 text-sm">Susikurkite paskyrą</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 text-left"
          >
            Elektroninis paštas
          </label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            onBlur={handleCheckEmail}
            required
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {emailError.errorType === ErrorType.EmailRegistered && (
            <p className="text-sm text-red-500 mt-1">{emailError.message}</p>
          )}
        </div>

        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 text-left"
          >
            Vardas
          </label>
          <input
            type="text"
            name="firstName"
            value={credentials.firstName}
            onChange={handleInputChange}
            required
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:rding-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 text-left"
          >
            Pavardė
          </label>
          <input
            type="text"
            name="lastName"
            value={credentials.lastName}
            onChange={handleInputChange}
            required
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 text-left"
          >
            Slaptažodis
          </label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handlePasswordChange}
            required
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {error.errorType === ErrorType.TooWeakPassword && (
            <p className="text-sm text-red-500 mt-1">Slaptažodis per silpnas</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 text-left"
          >
            Patvirtinkite slaptažodį
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={credentials.confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {error.errorType === ErrorType.PasswordNotMatch && (
            <p className="text-sm text-red-500 mt-1">Slaptažodžiai nesutampa</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 mt-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60"
        >
          {isSubmitting ? "Registruojama..." : "Prisiregistruoti"}
        </button>
      </form>

      {/* Footer */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Jau turite paskyrą?{" "}
          <Link
            to={appRoutes.auth.login}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Prisijungti
          </Link>
        </p>
      </div>
    </div>
  );
}
