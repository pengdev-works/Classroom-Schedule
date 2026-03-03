import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Classrooms from "../pages/classrooms/Classrooms";
import Teachers from "../pages/teachers/Teachers";
import Subjects from "../pages/subjects/Subjects";
import Schedule from "../pages/schedules/Schedule";
import Enrollments from "../pages/enrollments/Enrollments";
import { useAuth } from "../hooks/useAuth";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/" replace />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/" replace />}
      />

      {/* Dashboard and protected routes */}
      <Route
        path="/"
        element={user ? <Dashboard /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/classrooms"
        element={user ? <Classrooms /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/teachers"
        element={user ? <Teachers /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/subjects"
        element={user ? <Subjects /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/schedules"
        element={user ? <Schedule /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/enrollments"
        element={user ? <Enrollments /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;