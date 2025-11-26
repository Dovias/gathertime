import { Outlet } from "react-router";
import Navigation from "../../components/main/Navigation";

export default function Layout() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navigation />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}
