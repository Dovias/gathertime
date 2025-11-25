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

  const formatDate = () => {
    const now = new Date();
    const monthDay = new Intl.DateTimeFormat("lt-LT", {
      month: "long",
      day: "numeric",
    }).format(now);

    const weekday = new Intl.DateTimeFormat("lt-LT", {
      weekday: "long",
    }).format(now);

    const capitalizedMonthDay =
      monthDay.charAt(0).toUpperCase() + monthDay.slice(1);
    const capitalizedWeekday =
      weekday.charAt(0).toUpperCase() + weekday.slice(1);

    return `${capitalizedMonthDay}, ${capitalizedWeekday}`;
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navigation onLogout={handleLogout} />

      <main className="flex-grow flex flex-col px-10 pt-6">
        <div className="w-full">
          <p className="text-2xl text-black mb-2">{formatDate()}</p>
        </div>

        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">
              Calendar
            </h2>
            <p className="text-gray-500">
              This is where calendar content will go.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Calendar;
