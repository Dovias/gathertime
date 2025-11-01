import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../utilities/Routes";

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">GatherTime Calendar</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          Log Out
        </button>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">Calendar</h2>
          <p className="text-gray-500">This is where calendar content will go.</p>
        </div>
      </main>
    </div>
  );
}

export default Calendar;
