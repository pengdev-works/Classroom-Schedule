import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold">Classroom Scheduler</h1>

      {user && (
        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;