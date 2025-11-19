import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/authentication/Login";
import Registration from "./components/authentication/Registration";
import VerifyEmail from "./components/authentication/VerifyEmail";
import Calendar from "./components/main/Calendar";
import { AppRoutes } from "./utilities/Routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to={AppRoutes.LOG_IN} />} />
        <Route path={AppRoutes.LOG_IN} element={<Login />} />
        <Route path={AppRoutes.SIGN_UP} element={<Registration />} />
        <Route path={AppRoutes.CALENDAR} element={<Calendar />} />
        <Route path={AppRoutes.VERIFY_EMAIL} element={<VerifyEmail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
