import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState("Dashboard");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState("");

  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [quizError, setQuizError] = useState("");

  const [showQuizForm, setShowQuizForm] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [creatingQuiz, setCreatingQuiz] = useState(false);

  const [editingQuiz, setEditingQuiz] = useState(null);
  const [updatingQuiz, setUpdatingQuiz] = useState(false);


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


useEffect(() => {
  if (activePage !== "Quizzes") {
    return;
  }

  const fetchQuizzes = async () => {
    try {
      setLoadingQuizzes(true);
      setQuizError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5001/api/quizzes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch quizzes");
      }

      setQuizzes(data.quizzes);
    } catch (error) {
      setQuizError(error.message);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  fetchQuizzes();
}, [activePage]);                                                     

  const handleNavigation = (page) => {
    setActivePage(page);
  };

const handlePublishQuiz = async (quiz) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5001/api/quizzes/${quiz.id}/publish`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_published: !quiz.is_published,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update quiz status");
    }

    setQuizzes((previousQuizzes) =>
      previousQuizzes.map((item) =>
        item.id === quiz.id ? data.quiz : item
      )
    );
  } catch (error) {
    setQuizError(error.message);
  }
};


const handleDeleteQuiz = async (quiz) => {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete "${quiz.title}"?`
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5001/api/quizzes/${quiz.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to delete quiz"
      );
    }

    setQuizzes((previousQuizzes) =>
      previousQuizzes.filter(
        (item) => item.id !== quiz.id
      )
    );
  } catch (error) {
    setQuizError(error.message);
  }
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
  <section className="quiz-management">
    <div className="quiz-management-header">
      <h2>Quiz Management</h2>

      <button className="create-quiz-button" onClick={() => setShowQuizForm(true)}>
        + Create Quiz
      </button>
    </div>

    {showQuizForm && (
  <div className="quiz-form">
    <h3>Create Quiz</h3>

    <input
      type="text"
      placeholder="Quiz title"
      value={quizTitle}
      onChange={(e) => setQuizTitle(e.target.value)}
    />

    <textarea
      placeholder="Quiz description"
      value={quizDescription}
      onChange={(e) => setQuizDescription(e.target.value)}
    />

    <div className="quiz-form-actions">
      <button
        type="button"
        onClick={() => {
          setShowQuizForm(false);
          setQuizTitle("");
          setQuizDescription("");
        }}
      >
        Cancel
      </button>

      <button
        type="button"
        disabled={creatingQuiz}
        onClick={async () => {
          try {
            setCreatingQuiz(true);
            setQuizError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
              "http://localhost:5001/api/quizzes",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  title: quizTitle,
                  description: quizDescription,
                }),
              }
            );

            const data = await response.json();

            if (!response.ok) {
              throw new Error(
                data.message || "Failed to create quiz"
              );
            }

            setQuizzes((previousQuizzes) => [
              data.quiz,
              ...previousQuizzes,
            ]);

            setQuizTitle("");
            setQuizDescription("");
            setShowQuizForm(false);
          } catch (error) {
            setQuizError(error.message);
          } finally {
            setCreatingQuiz(false);
          }
        }}
      >
        {creatingQuiz ? "Creating..." : "Create Quiz"}
      </button>
    </div>
  </div>
)}

{editingQuiz && (
  <div className="quiz-form">
    <h3>Edit Quiz</h3>

    <input
      type="text"
      placeholder="Quiz title"
      value={quizTitle}
      onChange={(e) => setQuizTitle(e.target.value)}
    />

    <textarea
      placeholder="Quiz description"
      value={quizDescription}
      onChange={(e) => setQuizDescription(e.target.value)}
    />

    <div className="quiz-form-actions">
      <button
        type="button"
        onClick={() => {
          setEditingQuiz(null);
          setQuizTitle("");
          setQuizDescription("");
        }}
      >
        Cancel
      </button>

      <button
        type="button"
        disabled={updatingQuiz}
        onClick={async () => {
          try {
            setUpdatingQuiz(true);
            setQuizError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
              `http://localhost:5001/api/quizzes/${editingQuiz.id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  title: quizTitle,
                  description: quizDescription,
                }),
              }
            );

            const data = await response.json();

            if (!response.ok) {
              throw new Error(
                data.message || "Failed to update quiz"
              );
            }

            setQuizzes((previousQuizzes) =>
              previousQuizzes.map((quiz) =>
                quiz.id === editingQuiz.id
                  ? data.quiz
                  : quiz
              )
            );

            setEditingQuiz(null);
            setQuizTitle("");
            setQuizDescription("");
          } catch (error) {
            setQuizError(error.message);
          } finally {
            setUpdatingQuiz(false);
          }
        }}
      >
        {updatingQuiz ? "Saving..." : "Save Changes"}
      </button>
    </div>
  </div>
)}

    {loadingQuizzes && <p>Loading quizzes...</p>}

    {quizError && (
      <p className="error-message">{quizError}</p>
    )}

    {!loadingQuizzes && !quizError && (
      <div className="quiz-list">
        {quizzes.length === 0 ? (
          <p>No quizzes found.</p>
        ) : (
          quizzes.map((quiz) => (
            <div className="quiz-card" key={quiz.id}>
              <div className="quiz-card-content">
                <h3>{quiz.title}</h3>

                <p>
                  {quiz.description || "No description available."}
                </p>

                <span
                  className={
                    quiz.is_published
                      ? "quiz-status published"
                      : "quiz-status unpublished"
                  }
                >
                  {quiz.is_published
                    ? "Published"
                    : "Unpublished"}
                </span>
              </div>

              <div className="quiz-card-actions">
  <button
    onClick={() => {
      setEditingQuiz(quiz);
      setQuizTitle(quiz.title);
      setQuizDescription(quiz.description || "");
    }}
  >
    Edit
  </button>

  <button
  onClick={() => handleDeleteQuiz(quiz)}
>
  Delete
</button>

  <button
    onClick={() => handlePublishQuiz(quiz)}
  >
    {quiz.is_published ? "Unpublish" : "Publish"}
  </button>
</div>
            </div>
          ))
        )}
      </div>
    )}
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