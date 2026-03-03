import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, loginUser } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import Swal from "sweetalert2";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin", // default role
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Register user
      await registerUser(form);

      // Auto-login after successful registration
      const loginRes = await loginUser({
        email: form.email,
        password: form.password,
      });

      // Save user data in auth context
      login(loginRes.data.user, loginRes.data.token);

      // ✅ Success Alert
      await Swal.fire({
        title: "Registration Successful!",
        text: "Welcome! You are now logged in.",
        icon: "success",
        confirmButtonColor: "#2563EB",
        timer: 2000,
        timerProgressBar: true,
      });

      navigate("/"); // redirect to dashboard
    } catch (err) {
      console.error(err);
      // Display detailed error from backend if available
      const errorMessage = err.response?.data?.message || "Registration failed";
      
      // ✅ Error Alert
      Swal.fire({
        title: "Oops!",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-lg rounded-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full border p-2 mb-4 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 mb-4 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
          onChange={handleChange}
          required
        />

        <label className="block mb-4">
          Role
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="admin">Admin</option>
            <option value="student">Student</option>
            <option value="user">User</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;