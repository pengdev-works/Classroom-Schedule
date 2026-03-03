import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Swal from "sweetalert2";
import { API } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Enrollments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    student_id: "",
    classroom_id: "",
  });

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
      Swal.fire({
        title: "Access Denied",
        text: "Only admins can manage student enrollments",
        icon: "warning",
        confirmButtonColor: "#EF4444",
      });
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch classrooms (always required)
        const classRes = await API.get("/api/classrooms");
        setClassrooms(classRes.data);

        // Fetch all users and filter for students
        try {
          const userRes = await API.get("/api/users");
          const studentsOnly = userRes.data.filter(u => u.role === "student");
          setStudents(studentsOnly);
        } catch (err) {
          console.warn("Could not fetch users list:", err);
          setStudents([]);
        }

        // Fetch enrollments if the endpoint exists
        try {
          const enrollRes = await API.get("/api/student-classrooms");
          setEnrollments(enrollRes.data);
        } catch (err) {
          console.warn("Could not fetch enrollments:", err);
          setEnrollments([]);
        }
      } catch (err) {
        console.error("Error fetching data", err);
        Swal.fire({
          title: "Error",
          text: `Failed to load data: ${err.response?.status === 404 ? "Endpoint not found" : err.message}`,
          icon: "error",
          confirmButtonColor: "#EF4444",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ student_id: "", classroom_id: "" });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.student_id || !formData.classroom_id) {
      Swal.fire({
        title: "Error",
        text: "Please select both a student and classroom",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
      return;
    }

    // Check if already enrolled
    const alreadyEnrolled = enrollments.some(
      (en) =>
        en.student_id === parseInt(formData.student_id) &&
        en.classroom_id === parseInt(formData.classroom_id)
    );

    if (alreadyEnrolled) {
      Swal.fire({
        title: "Error",
        text: "Student is already enrolled in this classroom",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
      return;
    }

    try {
      await API.post("/api/student-classrooms", {
        student_id: parseInt(formData.student_id),
        classroom_id: parseInt(formData.classroom_id),
      });
      Swal.fire({
        title: "Success!",
        text: "Student enrolled successfully",
        icon: "success",
        confirmButtonColor: "#2563EB",
        timer: 1500,
        timerProgressBar: true,
      });

      // Refresh enrollments
      const enrollRes = await API.get("/api/student-classrooms");
      setEnrollments(enrollRes.data);
      resetForm();
    } catch (err) {
      console.error("Error enrolling student", err);
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Failed to enroll student",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleRemove = (enrollmentId) => {
    Swal.fire({
      title: "Remove enrollment?",
      text: "This cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, remove",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await API.delete(`/api/student-classrooms/${enrollmentId}`);
          setEnrollments(enrollments.filter((en) => en.id !== enrollmentId));
          Swal.fire({
            title: "Removed",
            text: "Enrollment removed",
            icon: "success",
            confirmButtonColor: "#2563EB",
            timer: 1500,
            timerProgressBar: true,
          });
        } catch (err) {
          console.error(err);
          Swal.fire({
            title: "Error",
            text: "Failed to remove enrollment",
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
          <h2 className="text-3xl font-bold">Student Enrollments</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {showForm ? "Cancel" : "+ Add Enrollment"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-bold mb-4">Enroll Student</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <select
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.email})
                  </option>
                ))}
              </select>

              <select
                name="classroom_id"
                value={formData.classroom_id}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Classroom</option>
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="col-span-2 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Enroll
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <p>Loading enrollments...</p>
        ) : (
          <>
            {students.length === 0 ? (
              <div className="bg-yellow-100 border border-yellow-400 p-4 rounded mb-6">
                <p className="text-yellow-800">
                  ⚠️ No students found. Make sure students have registered with the "Student" role.
                </p>
              </div>
            ) : null}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Student</th>
                    <th className="px-6 py-3 text-left font-semibold">Classroom</th>
                    <th className="px-6 py-3 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-3 text-center text-gray-500">
                        No enrollments yet
                      </td>
                    </tr>
                  ) : (
                    enrollments.map((en) => (
                      <tr key={en.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-3">
                          {students.find((s) => s.id === en.student_id)?.name || `Student #${en.student_id}`}
                        </td>
                        <td className="px-6 py-3">
                          {classrooms.find((c) => c.id === en.classroom_id)?.name || `Classroom #${en.classroom_id}`}
                        </td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() => handleRemove(en.id)}
                            className="py-1 px-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Enrollments;
