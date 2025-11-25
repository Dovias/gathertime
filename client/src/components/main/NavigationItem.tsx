import type { IconType } from "react-icons";
import { Link, useLocation } from "react-router-dom";

interface NavMenuItemProps {
  to: string;
  icon: IconType;
  label: string;
}

export function NavMenuItem({ to, icon: Icon, label }: NavMenuItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium ${
        isActive
          ? "bg-navy-hover text-white border-l-4 border-hover-indicator"
          : "text-white hover:bg-navy-hover"
      }`}
    >
      <span className="text-lg">
        <Icon />
      </span>
      {label}
    </Link>
  );
}
