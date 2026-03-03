import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);

      // ✅ Success Alert
      await Swal.fire({
        title: "Login Successful!",
        text: `Welcome back, ${res.data.user.name} 👋`,
        icon: "success",
        confirmButtonColor: "#2563EB", // Tailwind blue-600
        timer: 2000,
        timerProgressBar: true,
      });

      navigate("/"); // redirect to dashboard
    } catch (err) {
      // ✅ Error Alert
      Swal.fire({
        title: "Oops!",
        text: err.response?.data?.message || "Invalid email or password",
        icon: "error",
        confirmButtonColor: "#EF4444", // Tailwind red-500
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 mb-4 rounded"
          onChange={handleChange}
          value={form.email}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 mb-6 rounded"
          onChange={handleChange}
          value={form.password}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;