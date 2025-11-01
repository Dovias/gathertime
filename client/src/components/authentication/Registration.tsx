import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../utilities/Routes";
import { ErrorType } from "../../utilities/validations/ErrorType";
import { validatePasswords } from "../../utilities/validations/PasswordValidation";
import { fetchUserByEmail } from "../../api/UserApi";

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

function Registration() {
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
        errorType: ErrorType.NoError
    })

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value,
        }));
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleInputChange(event);
        const validationError = validatePasswords(event.target.value, credentials.confirmPassword);
        setError({ message: "", errorType: validationError });
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleInputChange(event);
        const validationError = validatePasswords(credentials.password, event.target.value);
        setError({ message: "", errorType: validationError });
    };

    const handleCheckEmail = async (event: React.FocusEvent<HTMLInputElement>) => {
        const { value } = event.target;

        try {
            const response = await fetchUserByEmail(value);

            if (response) {
                setEmailError({
                    message: 'Email is already registered',
                    errorType: ErrorType.EmailRegistered
                });
            } else {
                setEmailError({
                    message: '',
                    errorType: ErrorType.NoError
                });
            }
        } catch (error) {
            
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting || error.errorType !== ErrorType.NoError) return;

        setIsSubmitting(true);
        setError({ message: "", errorType: ErrorType.NoError });

        const registerCredentials = {
            email: credentials.email,
            password: credentials.password,
            firstName: credentials.firstName,
            lastName: credentials.lastName,
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/registration`, registerCredentials);
            console.log(response);
            navigate(AppRoutes.LOG_IN);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-50 px-4">
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-4xl font-semibold text-gray-800 mb-2">
                Welcome to <span className="text-indigo-600">GatherTime?</span>
                </h1>
                <p className="text-gray-500 text-sm">
                Create your account to get started
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 text-left"
                >
                    Email
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
                    First Name
                </label>
                <input
                    type="text"
                    name="firstName"
                    value={credentials.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                </div>

                {/* Last Name */}
                <div>
                <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 text-left"
                >
                    Last Name
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
                    Password
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
                    <p className="text-sm text-red-500 mt-1">Password is too weak</p>
                )}
                </div>

                {/* Confirm Password */}
                <div>
                <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 text-left"
                >
                    Confirm Password
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
                    <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
                )}
                </div>

                {/* Submit Button */}
                <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 mt-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60"
                >
                {isSubmitting ? "Signing up..." : "Sign Up"}
                </button>
            </form>

            {/* Footer */}
            <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                    to={AppRoutes.LOG_IN}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    Log in
                </Link>
                </p>
            </div>
            </div>
        </div>
        );
}

export default Registration;