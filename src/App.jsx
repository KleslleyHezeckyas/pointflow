import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  if (!token) return <Navigate to="/" />;
  if (role && userRole !== role) return <Navigate to="/dashboard" />;
  return children;
};

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/admin" element={
            <PrivateRoute role="ADMIN"><Admin /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
  );
}