import axios from "axios";
import { useEffect, useState } from "react";
import { fetchUserByEmail, fetchUserById } from "../../api/UserApi";
import { ErrorType } from "../../utilities/validations/ErrorType";
import { validatePasswords } from "../../utilities/validations/PasswordValidation";

interface Err {
  message: string;
  errorType: ErrorType;
}

interface ProfileFields {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export default function Profile() {
  const [profile, setProfile] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });

  const [profileForm, setProfileForm] = useState<ProfileFields>({
    id: 0,
    email: "",
    firstName: "",
    lastName: "",
  });

  const [emailError, setEmailError] = useState<Err>({
    message: "",
    errorType: ErrorType.NoError,
  });

  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState<Err>({
    message: "",
    errorType: ErrorType.NoError,
  });

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 1000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      console.error("No user found in localStorage");
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user.id;

    const loadUser = async () => {
      try {
        const data = await fetchUserById(userId);
        if (!data) return;

        setProfile({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        });

        setProfileForm({
          id: data.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        });
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    loadUser();
  }, []);

  const handleProfileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setEmailError({ message: "", errorType: ErrorType.NoError });
    }
  };

  const handleCheckEmail = async (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === profile.email) {
      setEmailError({
        message: "",
        errorType: ErrorType.NoError,
      });
      return;
    }

    try {
      const user = await fetchUserByEmail(value);

      if (user !== null) {
        setEmailError({
          message: "Šis e. paštas jau naudojamas",
          errorType: ErrorType.EmailRegistered,
        });
      } else {
        setEmailError({
          message: "",
          errorType: ErrorType.NoError,
        });
      }
    } catch (err) {
      console.error("email check failed", err);
    }
  };

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError.errorType !== ErrorType.NoError) return;

    await axios.put("/user/update-profile", profileForm);
    setSuccessMessage("Duomenys atnaujinti sėkmingai!");
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordError.errorType !== ErrorType.NoError) return;

    await axios.put("/user/change-password", {
      id: profileForm.id,
      password: passwordForm.password,
    });

    setSuccessMessage("Slaptažodis pakeistas!");
    setPasswordForm({ password: "", confirmPassword: "" });
  };

  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      {successMessage && (
        <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg text-center font-medium">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT – PERSONAL INFO */}
        <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Asmeninė informacija
          </h2>

          <form onSubmit={submitProfile} className="space-y-5">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Vardas
              </label>
              <input
                id="firstName"
                name="firstName"
                value={profileForm.firstName}
                onChange={handleProfileInput}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Pavardė
              </label>
              <input
                id="lastName"
                name="lastName"
                value={profileForm.lastName}
                onChange={handleProfileInput}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Elektroninis paštas
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={profileForm.email}
                onChange={handleProfileInput}
                onBlur={handleCheckEmail}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
              {emailError.errorType !== ErrorType.NoError && (
                <p className="text-red-600 text-sm mt-1">
                  {emailError.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-md"
            >
              Išsaugoti pakeitimus
            </button>
          </form>
        </section>

        {/* RIGHT – PASSWORD CHANGE */}
        <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Keisti slaptažodį
          </h2>

          <form
            onSubmit={submitPassword}
            className="flex flex-col gap-5 flex-grow"
          >
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Naujas slaptažodis
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={passwordForm.password}
                onChange={(e) => {
                  const { name, value } = e.target;

                  setPasswordForm((prev) => {
                    const updated = { ...prev, [name]: value };
                    const error = validatePasswords(
                      updated.password,
                      updated.confirmPassword,
                    );

                    if (error !== ErrorType.NoError) {
                      setPasswordError({
                        message:
                          error === ErrorType.TooWeakPassword
                            ? "Slaptažodis per silpnas"
                            : "Slaptažodžiai nesutampa",
                        errorType: error,
                      });
                    } else {
                      setPasswordError({
                        message: "",
                        errorType: ErrorType.NoError,
                      });
                    }

                    return updated;
                  });
                }}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Patvirtinkite slaptažodį
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={(e) => {
                  const { name, value } = e.target;

                  setPasswordForm((prev) => {
                    const updated = { ...prev, [name]: value };
                    const error = validatePasswords(
                      updated.password,
                      updated.confirmPassword,
                    );

                    if (error !== ErrorType.NoError) {
                      setPasswordError({
                        message:
                          error === ErrorType.TooWeakPassword
                            ? "Slaptažodis per silpnas"
                            : "Slaptažodžiai nesutampa",
                        errorType: error,
                      });
                    } else {
                      setPasswordError({
                        message: "",
                        errorType: ErrorType.NoError,
                      });
                    }

                    return updated;
                  });
                }}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />

              {passwordError.errorType !== ErrorType.NoError && (
                <p className="text-red-600 text-sm mt-1">
                  {passwordError.message}
                </p>
              )}
            </div>

            <div className="mt-auto pt-4">
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-md"
              >
                Keisti slaptažodį
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
