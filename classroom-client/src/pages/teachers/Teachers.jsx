import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Swal from "sweetalert2";
import { API } from "../../services/api";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/teachers");
      setTeachers(res.data);
    } catch (err) {
      console.error("Error fetching teachers", err);
      Swal.fire({
        title: "Error",
        text: "Failed to load teachers",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ name: "", email: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      Swal.fire({
        title: "Error",
        text: "Please fill in all fields",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
      return;
    }
    try {
      if (editingId) {
        await API.put(`/api/teachers/${editingId}`, formData);
        Swal.fire({
          title: "Success!",
          text: "Teacher updated",
          icon: "success",
          confirmButtonColor: "#2563EB",
          timer: 1500,
          timerProgressBar: true,
        });
      } else {
        await API.post("/api/teachers", formData);
        Swal.fire({
          title: "Success!",
          text: "Teacher added",
          icon: "success",
          confirmButtonColor: "#2563EB",
          timer: 1500,
          timerProgressBar: true,
        });
      }
      fetchTeachers();
      resetForm();
    } catch (err) {
      console.error("Error saving teacher", err);
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Failed to save teacher",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleEdit = (t) => {
    setFormData({ name: t.name, email: t.email });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete!",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await API.delete(`/api/teachers/${id}`);
          setTeachers(teachers.filter((t) => t.id !== id));
          Swal.fire({
            title: "Deleted",
            text: "Teacher removed",
            icon: "success",
            confirmButtonColor: "#2563EB",
            timer: 1500,
            timerProgressBar: true,
          });
        } catch (err) {
          console.error("Delete error", err);
          Swal.fire({
            title: "Error",
            text: "Failed to delete teacher",
            icon: "error",
            confirmButtonColor: "#EF4444",
          });
        }
      }
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Teachers</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {showForm ? "Cancel" : "+ Add Teacher"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? "Edit Teacher" : "New Teacher"}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                name="email"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <button
                type="submit"
                className="col-span-2 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                {editingId ? "Update" : "Add"}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <p>Loading teachers...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((t) => (
              <div
                key={t.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-2">{t.name}</h3>
                <p className="text-gray-600 mb-4">{t.email}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(t)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Teachers;