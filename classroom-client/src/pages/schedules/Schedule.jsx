import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Swal from "sweetalert2";
import { API } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const Schedule = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [studentClassrooms, setStudentClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    classroom_id: "",
    subject_id: "",
    teacher_id: "",
    day: "Monday",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [schedRes, classRes, teachRes, subjRes] = await Promise.all([
          API.get("/api/schedules"),
          API.get("/api/classrooms"),
          API.get("/api/teachers"),
          API.get("/api/subjects"),
        ]);
        setSchedules(schedRes.data);
        setClassrooms(classRes.data);
        setTeachers(teachRes.data);
        setSubjects(subjRes.data);

        // If student, fetch their enrolled classrooms
        if (user && user.role === "student") {
          try {
            const studentRes = await API.get("/api/student-classrooms");
            setStudentClassrooms(studentRes.data.map(sc => sc.classroom_id));
          } catch (err) {
            console.log("No enrolled classrooms found for student", err);
            setStudentClassrooms([]);
          }
        }
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      classroom_id: "",
      subject_id: "",
      teacher_id: "",
      day: "Monday",
      start_time: "",
      end_time: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.classroom_id || !formData.subject_id || !formData.teacher_id || !formData.day || !formData.start_time || !formData.end_time) {
      Swal.fire({
        title: "Error",
        text: "Please fill in all fields",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
      return;
    }
    try {
      const payload = {
        classroom_id: parseInt(formData.classroom_id),
        subject_id: parseInt(formData.subject_id),
        teacher_id: parseInt(formData.teacher_id),
        day: formData.day,
        start_time: formData.start_time,
        end_time: formData.end_time,
      };
      if (editingId) {
        await API.put(`/api/schedules/${editingId}`, payload);
        Swal.fire({
          title: "Success!",
          text: "Schedule updated",
          icon: "success",
          confirmButtonColor: "#2563EB",
          timer: 1500,
          timerProgressBar: true,
        });
      } else {
        await API.post("/api/schedules", payload);
        Swal.fire({
          title: "Success!",
          text: "Schedule created",
          icon: "success",
          confirmButtonColor: "#2563EB",
          timer: 1500,
          timerProgressBar: true,
        });
      }
      const allSchedules = await API.get("/api/schedules");
      setSchedules(allSchedules.data);
      resetForm();
    } catch (err) {
      console.error("Error saving schedule", err);
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Failed to save schedule",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleEdit = (s) => {
    setFormData({
      classroom_id: s.classroom_id,
      subject_id: s.subject_id,
      teacher_id: s.teacher_id,
      day: s.day,
      start_time: s.start_time,
      end_time: s.end_time,
    });
    setEditingId(s.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete schedule?",
      text: "This cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete"
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await API.delete(`/api/schedules/${id}`);
          setSchedules(schedules.filter((s) => s.id !== id));
          Swal.fire({
            title: "Deleted",
            text: "Schedule removed",
            icon: "success",
            confirmButtonColor: "#2563EB",
            timer: 1500,
            timerProgressBar: true,
          });
        } catch (err) {
          console.error(err);
          Swal.fire({
            title: "Error",
            text: "Failed to delete schedule",
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
          <h2 className="text-3xl font-bold">
            {user?.role === "student" ? "My Class Schedules" : "Schedules"}
          </h2>
          {user?.role !== "student" && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {showForm ? "Cancel" : "+ Add Schedule"}
            </button>
          )}
        </div>

        {showForm && user?.role !== "student" && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? "Edit Schedule" : "New Schedule"}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <select
                name="classroom_id"
                value={formData.classroom_id}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Classroom</option>
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                name="subject_id"
                value={formData.subject_id}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <select
                name="teacher_id"
                value={formData.teacher_id}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>

              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              >
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
                <option>Sunday</option>
              </select>

              <input
                name="start_time"
                type="time"
                value={formData.start_time}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

              <input
                name="end_time"
                type="time"
                value={formData.end_time}
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
          <p>Loading schedules...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules
              .filter(s => user?.role === "student" ? studentClassrooms.includes(s.classroom_id) : true)
              .map((s) => (
              <div
                key={s.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-2">{s.day}</h3>
                <div className="space-y-2 mb-4 text-gray-600">
                  <p><span className="font-semibold">Classroom:</span> {classrooms.find(c => c.id === s.classroom_id)?.name}</p>
                  <p><span className="font-semibold">Subject:</span> {subjects.find(s2 => s2.id === s.subject_id)?.name}</p>
                  <p><span className="font-semibold">Teacher:</span> {teachers.find(t => t.id === s.teacher_id)?.name}</p>
                  <p><span className="font-semibold">Time:</span> {s.start_time} - {s.end_time}</p>
                </div>
                {user?.role !== "student" && (
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
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Schedule;