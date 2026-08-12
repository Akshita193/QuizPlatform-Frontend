import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard({ onLogout }) {
    const [activePage, setActivePage] = useState("Dashboard");
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [userError, setUserError] = useState("");


useEffect(() => {
  if (activePage !== "Users") {
    return;
  }

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      setUserError("");

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5001/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setUsers(data.users);
    } catch (error) {
      setUserError(error.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  fetchUsers();
}, [activePage]);

  const handleNavigation = (page) => {
    setActivePage(page);
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>QuizPlatform</h2>

        <nav>
          <button
            className={activePage === "Dashboard" ? "active" : ""}
            onClick={() => handleNavigation("Dashboard")}
          >
            Dashboard
          </button>

          <button
            className={activePage === "Users" ? "active" : ""}
            onClick={() => handleNavigation("Users")}
          >
            Users
          </button>

          <button
            className={activePage === "Quizzes" ? "active" : ""}
            onClick={() => handleNavigation("Quizzes")}
          >
            Quizzes
          </button>

          <button
            className={activePage === "Results" ? "active" : ""}
            onClick={() => handleNavigation("Results")}
          >
            Results
          </button>
        </nav>

        <button className="logout-button" onClick={onLogout}>
            Logout
        </button>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>{activePage}</h1>

          <p>
            {activePage === "Dashboard"
              ? "Welcome to QuizPlatform Admin Panel"
              : `${activePage} section`}
          </p>
        </header>

        {activePage === "Dashboard" && (
          <section className="statistics">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>25</p>
            </div>

            <div className="stat-card">
              <h3>Active Users</h3>
              <p>22</p>
            </div>

            <div className="stat-card">
              <h3>Total Quizzes</h3>
              <p>10</p>
            </div>
          </section>
        )}

        {activePage === "Users" && (
  <section className="user-management">
    <h2>User Management</h2>

    {loadingUsers && <p>Loading users...</p>}

    {userError && <p className="error-message">{userError}</p>}

    {!loadingUsers && !userError && (
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status ? "Active" : "Inactive"}</td>
                <td>
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
)}

        {activePage === "Quizzes" && (
          <section className="dashboard-placeholder">
            <h2>Quiz Management</h2>
            <p>Quiz management will be added later.</p>
          </section>
        )}

        {activePage === "Results" && (
          <section className="dashboard-placeholder">
            <h2>Results</h2>
            <p>Quiz results will appear here.</p>
          </section>
        )}
      </main>
    </div>
  );
}


export default AdminDashboard;