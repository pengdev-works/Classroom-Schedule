import Sidebar from "../../components/layout/Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import { API } from "../../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { label: "Classrooms", count: 0, color: "bg-blue-500", icon: "🎓" },
    { label: "Teachers", count: 0, color: "bg-green-500", icon: "👨‍🏫" },
    { label: "Subjects", count: 0, color: "bg-purple-500", icon: "📚" },
    { label: "Schedules", count: 0, color: "bg-orange-500", icon: "📅" },
  ]);

  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.role === "student") {
          // For students, only fetch their enrolled classrooms and corresponding schedules
          const [classRes, schedRes] = await Promise.all([
            API.get("/api/student-classrooms"),
            API.get("/api/schedules"),
          ]);
          
          const studentClassroomIds = classRes.data.map(sc => sc.classroom_id);
          const studentSchedules = schedRes.data.filter(s => studentClassroomIds.includes(s.classroom_id));
          
          setStats([
            { label: "My Classrooms", count: studentClassroomIds.length, color: "bg-blue-500", icon: "🎓" },
            { label: "My Schedules", count: studentSchedules.length, color: "bg-orange-500", icon: "📅" },
          ]);
        } else {
          // For admins, show all stats
          const [classRes, teachRes, subRes, schedRes] = await Promise.all([
            API.get("/api/classrooms"),
            API.get("/api/teachers"),
            API.get("/api/subjects"),
            API.get("/api/schedules"),
          ]);

          setStats([
            { label: "Classrooms", count: classRes.data.length, color: "bg-blue-500", icon: "🎓" },
            { label: "Teachers", count: teachRes.data.length, color: "bg-green-500", icon: "👨‍🏫" },
            { label: "Subjects", count: subRes.data.length, color: "bg-purple-500", icon: "📚" },
            { label: "Schedules", count: schedRes.data.length, color: "bg-orange-500", icon: "📅" },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-3xl font-bold mb-6">Welcome, {user?.name}!</h2>
        
        {/* Stats Grid */}
        {loadingStats ? (
          <div className="text-center mb-8">Loading stats...</div>
        ) : (
          <div className={`grid ${user?.role === "student" ? "grid-cols-2" : "grid-cols-4"} gap-4 mb-8`}>
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.count}</p>
                  </div>
                  <div className={`${stat.color} text-white text-3xl p-4 rounded-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;