import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Classrooms from "../pages/classrooms/Classrooms";
import Teachers from "../pages/teachers/Teachers";
import Subjects from "../pages/subjects/Subjects";
import Schedule from "../pages/schedules/Schedule";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/classrooms" element={<PrivateRoute><Classrooms /></PrivateRoute>} />
        <Route path="/teachers" element={<PrivateRoute><Teachers /></PrivateRoute>} />
        <Route path="/subjects" element={<PrivateRoute><Subjects /></PrivateRoute>} />
        <Route path="/schedules" element={<PrivateRoute><Schedule /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;