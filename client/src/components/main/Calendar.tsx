import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../utilities/Routes";
import Navigation from "./Navigation.tsx";

function Calendar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      localStorage.removeItem("user");

      navigate(AppRoutes.LOG_IN);
    }
  };

  return (
      <div className="min-h-screen flex bg-gray-50">
          <Navigation onLogout={handleLogout} />

          <main className="flex-grow flex items-center justify-center p-6">
              <div className="text-center">
                  <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                      Calendar
                  </h2>
                  <p className="text-gray-500">
                      This is where calendar content will go.
                  </p>
              </div>
          </main>
      </div>
  );
}

export default Calendar;
