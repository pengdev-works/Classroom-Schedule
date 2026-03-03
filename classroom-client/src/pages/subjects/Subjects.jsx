import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Swal from "sweetalert2";
import { API } from "../../services/api";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", code: "", units: 3 });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/subjects");
      setSubjects(res.data);
    } catch (err) {
      console.error("Error fetching subjects", err);
      Swal.fire({
        title: "Error",
        text: "Failed to load subjects",
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
    setFormData({ name: "", code: "", units: 3 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      Swal.fire({
        title: "Error",
        text: "Name and Code are required",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
      return;
    }
    try {
      if (editingId) {
        await API.put(`/api/subjects/${editingId}`, formData);
        Swal.fire({
          title: "Success!",
          text: "Subject updated",
          icon: "success",
          confirmButtonColor: "#2563EB",
          timer: 1500,
          timerProgressBar: true,
        });
      } else {
        await API.post("/api/subjects", formData);
        Swal.fire({
          title: "Success!",
          text: "Subject added",
          icon: "success",
          confirmButtonColor: "#2563EB",
          timer: 1500,
          timerProgressBar: true,
        });
      }
      fetchSubjects();
      resetForm();
    } catch (err) {
      console.error("Error saving subject", err);
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Failed to save subject",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleEdit = (s) => {
    setFormData({ name: s.name, code: s.code, units: s.units || 3 });
    setEditingId(s.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete subject?",
      text: "This cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete"
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await API.delete(`/api/subjects/${id}`);
          setSubjects(subjects.filter((s) => s.id !== id));
          Swal.fire({
            title: "Deleted",
            text: "Subject removed",
            icon: "success",
            confirmButtonColor: "#2563EB",
            timer: 1500,
            timerProgressBar: true,
          });
        } catch (err) {
          console.error(err);
          Swal.fire({
            title: "Error",
            text: "Failed to delete subject",
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
          <h2 className="text-3xl font-bold">Subjects</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {showForm ? "Cancel" : "+ Add Subject"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? "Edit Subject" : "New Subject"}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Subject Name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                name="code"
                placeholder="Code"
                value={formData.code}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                name="units"
                placeholder="Units"
                type="number"
                value={formData.units}
                onChange={handleChange}
                className="col-span-2 border p-2 rounded"
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
          <p>Loading subjects...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((s) => (
              <div
                key={s.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-2">{s.name}</h3>
                <div className="space-y-2 mb-4 text-gray-600">
                  <p><span className="font-semibold">Code:</span> {s.code}</p>
                  <p><span className="font-semibold">Units:</span> {s.units}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
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

export default Subjects;