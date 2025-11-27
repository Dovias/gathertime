import { CgProfile } from "react-icons/cg";
import {
  FaCalendarAlt,
  FaCog,
  FaPowerOff,
  FaSearch,
  FaUserFriends,
} from "react-icons/fa";
import { ImCheckmark } from "react-icons/im";
import { useNavigate } from "react-router";
import logo from "../../assets/logo_nobg.png";
import type { User } from "../../models/User";
import { appRoutes } from "../../routes";
import { NavMenuItem } from "./NavigationItem";

export type NavigationProps = {
  user: User;
};

function Navigation({ user }: NavigationProps) {
  const navigate = useNavigate();
  const onLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      localStorage.removeItem("user");
      navigate(appRoutes.auth.index);
    }
  };

  return (
    <aside className="w-64 bg-navy shadow-lg flex flex-col">
      <div className="px-6 pt-6 flex flex-col items-center gap-4">
        <img src={logo} alt="GatherTime logo" className="w-50 h-10" />
        <div className="w-50 border-b border-gray-light/20"></div>
      </div>

      <nav className="flex-grow py-4">
        <NavMenuItem
          to={appRoutes.dashboard.calendar}
          icon={FaCalendarAlt}
          label="Kalendorius"
        />
        <NavMenuItem
          to={appRoutes.dashboard.feed}
          icon={FaSearch}
          label="Galimi susitikimai"
        />
        <NavMenuItem
          to={appRoutes.dashboard.meetings}
          icon={ImCheckmark}
          label="Suplanuoti susitikimai"
        />
        <NavMenuItem
          to={appRoutes.dashboard.friends}
          icon={FaUserFriends}
          label="Draugai ir grupės"
        />
      </nav>

      <nav>
        <NavMenuItem
          to={appRoutes.dashboard.profile}
          icon={CgProfile}
          label={`${user.firstName} ${user.lastName}`}
        />
        <NavMenuItem
          to={appRoutes.dashboard.settings}
          icon={FaCog}
          label="Nustatymai"
        />
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
