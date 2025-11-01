import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppRoutes } from './utilities/Routes'
import Registration from './components/authentication/Registration'
import Login from './components/authentication/Login'
import Calendar from './components/main/Calendar'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to={AppRoutes.LOG_IN} />} />
        <Route path={AppRoutes.LOG_IN} element={<Login />} />
        <Route path={AppRoutes.SIGN_UP} element={<Registration />} />
        <Route path={AppRoutes.CALENDAR} element={<Calendar />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
