import { FaCalendarAlt, FaPowerOff, FaSearch } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo_nobg.png";
import { AppRoutes } from "../../utilities/Routes";

interface NavMenuProps {
  onLogout: () => void;
}

function Navigation({ onLogout }: NavMenuProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-navy shadow-lg flex flex-col">
      <div className="px-6 pt-6 flex flex-col items-center gap-4">
        <img src={logo} alt="GatherTime Logo" className="w-50 h-10" />
        <div className="w-50 border-b border-gray-light/20"></div>
      </div>

      <nav className="flex-grow py-4">
        <Link
          to={AppRoutes.CALENDAR}
          className={`flex items-center gap-3 px-4 py-3 text-sm font-medium ${
            isActive(AppRoutes.CALENDAR)
              ? "bg-navy-hover text-white border-l-4 border-hover-indicator"
              : "text-gray-700 hover:bg-navy-hover"
          }`}
        >
          <span className="text-lg">
            <FaCalendarAlt />
          </span>
          Kalendorius
        </Link>
        <Link
          to="/events"
          className={`flex items-center gap-3 px-4 py-3 text-sm font-medium ${
            isActive("/events")
              ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700"
              : "text-white hover:bg-navy-hover"
          }`}
        >
          <span className="text-lg">
            <FaSearch />
          </span>
          Galimi susitikimai
        </Link>
      </nav>

      <div className="border-t border-gray-light/20">
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 text-white px-4 py-3 text-sm font-medium transition-colors w-full hover:bg-navy-hover"
        >
          <span className="text-lg">
            <FaPowerOff />
          </span>
          Atsijungti
        </button>
      </div>
    </aside>
  );
}

export default Navigation;
