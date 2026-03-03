import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">Classroom Scheduler</h1>
      <nav className="flex-1">
        <ul className="space-y-3">
          <li>
            <Link
              to="/"
              className="block py-2 px-3 rounded hover:bg-blue-100 transition"
            >
              Dashboard
            </Link>
          </li>
          {user?.role !== "student" && (
            <>
              <li>
                <Link
                  to="/classrooms"
                  className="block py-2 px-3 rounded hover:bg-blue-100 transition"
                >
                  Classrooms
                </Link>
              </li>
              <li>
                <Link
                  to="/teachers"
                  className="block py-2 px-3 rounded hover:bg-blue-100 transition"
                >
                  Teachers
                </Link>
              </li>
              <li>
                <Link
                  to="/subjects"
                  className="block py-2 px-3 rounded hover:bg-blue-100 transition"
                >
                  Subjects
                </Link>
              </li>
            </>
          )}
          <li>
            <Link
              to="/schedules"
              className="block py-2 px-3 rounded hover:bg-blue-100 transition"
            >
              {user?.role === "student" ? "My Schedules" : "Schedules"}
            </Link>
          </li>
          {user?.role === "admin" && (
            <li>
              <Link
                to="/enrollments"
                className="block py-2 px-3 rounded hover:bg-blue-100 transition"
              >
                Enrollments
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="mt-auto">
        <p className="text-gray-600 mb-2">Logged in as {user?.name}</p>
        <button
          onClick={logout}
          className="w-full py-2 px-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;