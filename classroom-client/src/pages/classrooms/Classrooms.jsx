import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API } from "../../services/api";
import Sidebar from "../../components/layout/Sidebar";

const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    building: "",
  });

  // Fetch classrooms on mount
  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/classrooms");
      setClassrooms(response.data);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to load classrooms",
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
    setFormData({ name: "", capacity: "", building: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddClassroom = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.capacity) {
      Swal.fire({
        title: "Error",
        text: "Please fill in all required fields",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
      return;
    }

    try {
      if (editingId) {
        // Update existing classroom
        await API.put(`/api/classrooms/${editingId}`, {
          name: formData.name,
          capacity: parseInt(formData.capacity),
          building: formData.building || null,
        });

        Swal.fire({
          title: "Success!",
          text: "Classroom updated successfully",
          icon: "success",
          confirmButtonColor: "#2563EB",
          timer: 1500,
          timerProgressBar: true,
        });
      } else {
        // Create new classroom
        await API.post("/api/classrooms", {
          name: formData.name,
          capacity: parseInt(formData.capacity),
          building: formData.building || null,
        });

        Swal.fire({
          title: "Success!",
          text: "Classroom added successfully",
          icon: "success",
          confirmButtonColor: "#2563EB",
          timer: 1500,
          timerProgressBar: true,
        });
      }

      fetchClassrooms();
      resetForm();
    } catch (error) {
      console.error("Error saving classroom:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to save classroom",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleEdit = (classroom) => {
    setFormData({
      name: classroom.name,
      capacity: classroom.capacity,
      building: classroom.building || "",
    });
    setEditingId(classroom.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/api/classrooms/${id}`);
          setClassrooms(classrooms.filter((c) => c.id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "Classroom has been deleted.",
            icon: "success",
            confirmButtonColor: "#2563EB",
            timer: 1500,
            timerProgressBar: true,
          });
        } catch (error) {
          console.error("Error deleting classroom:", error);
          Swal.fire({
            title: "Error",
            text: "Failed to delete classroom",
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
          <h2 className="text-3xl font-bold">Classrooms</h2>
          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {showForm ? "Cancel" : "+ Add Classroom"}
          </button>
        </div>

        {/* Add/Edit Classroom Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4">
            {editingId ? "Edit Classroom" : "New Classroom"}
          </h3>
          <form onSubmit={handleAddClassroom} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Classroom Name *"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              name="capacity"
              placeholder="Capacity *"
              value={formData.capacity}
              onChange={handleChange}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="building"
              placeholder="Building (Optional)"
              value={formData.building}
              onChange={handleChange}
              className="col-span-2 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="col-span-2 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              {editingId ? "Update Classroom" : "Add Classroom"}
            </button>
          </form>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Loading classrooms...</p>
        </div>
      ) : (
        <>
          {/* Classrooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classrooms.map((classroom) => (
              <div
                key={classroom.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border-t-4 border-blue-600"
              >
                <h3 className="text-xl font-bold mb-2">{classroom.name}</h3>
                <div className="space-y-2 mb-4 text-gray-600">
                  <p>
                    <span className="font-semibold">Capacity:</span> {classroom.capacity}{" "}
                    students
                  </p>
                  {classroom.building && (
                    <p>
                      <span className="font-semibold">Building:</span>{" "}
                      {classroom.building}
                    </p>
                  )}
                  {classroom.created_at && (
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Created:</span>{" "}
                      {new Date(classroom.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(classroom)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(classroom.id)}
                    className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {classrooms.length === 0 && (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-600">
                No classrooms yet. Create one to get started!
              </p>
            </div>
          )}
        </>
      )}
        </main>
    </div>
  );
};
export default Classrooms;