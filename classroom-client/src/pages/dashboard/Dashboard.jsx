import Navbar from "../../components/layout/Navbar";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p>Welcome to the Classroom Schedule Management System</p>
      </div>
    </>
  );
};

export default Dashboard;