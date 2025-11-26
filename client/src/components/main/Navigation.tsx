import { CgProfile } from "react-icons/cg";
import {
  FaCalendarAlt,
  FaCog,
  FaPowerOff,
  FaSearch,
  FaUserFriends,
} from "react-icons/fa";
import { ImCheckmark } from "react-icons/im";
import logo from "../../assets/logo_nobg.png";
import { AppRoutes } from "../../utilities/Routes";
import { NavMenuItem } from "./NavigationItem";

interface NavMenuProps {
  onLogout: () => void;
}

function Navigation({ onLogout }: NavMenuProps) {
  return (
      <aside className="w-64 bg-navy shadow-lg flex flex-col">
        <div className="px-6 pt-6 flex flex-col items-center gap-4">
          <img src={logo} alt="GatherTime Logo" className="w-50 h-10" />
          <div className="w-50 border-b border-gray-light/20"></div>
        </div>

        <nav className="flex-grow py-4">
          <NavMenuItem
            to={AppRoutes.CALENDAR}
            icon={FaCalendarAlt}
            label="Kalendorius"
          />
          <NavMenuItem to="/events" icon={FaSearch} label="Galimi susitikimai" />
          <NavMenuItem
            to="/planned_meets"
            icon={ImCheckmark}
            label="Suplanuoti susitikimai"
          />
          <NavMenuItem
            to="/friends"
            icon={FaUserFriends}
            label="Draugai ir grupės"
          />
        </nav>

        <nav>
          <NavMenuItem to="/profile" icon={CgProfile} label="Profilis" />
          <NavMenuItem to="/settings" icon={FaCog} label="Nustatymai" />
        </nav>
        <div className="border-t border-gray-light/20">
            <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-3 text-white px-4 py-3 text-sm font-medium transition-colors w-full hover:bg-navy-hover"
            >
                <span className="text-lg">
                    <FaPowerOff/>
                </span>
                Atsijungti
            </button>
        </div>
      </aside>
    );
}

export default Navigation;
