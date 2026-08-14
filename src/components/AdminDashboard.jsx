import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState("Dashboard");

  // ---------------- USERS ----------------
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState("");

  // ---------------- QUIZZES ----------------
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [quizError, setQuizError] = useState("");

  const [showQuizForm, setShowQuizForm] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [creatingQuiz, setCreatingQuiz] = useState(false);

  const [editingQuiz, setEditingQuiz] = useState(null);
  const [updatingQuiz, setUpdatingQuiz] = useState(false);

  // ---------------- CATEGORIES ----------------
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);
  const [updatingCategory, setUpdatingCategory] = useState(false);

  // ---------------- Questions ----------------
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [questionList, setQuestionList] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionError, setQuestionError] = useState("");

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [questionOptions, setQuestionOptions] = useState([
  { option_text: "", is_correct: false },
  { option_text: "", is_correct: false },
  { option_text: "", is_correct: false },
  { option_text: "", is_correct: false },
  ]);

const [creatingQuestion, setCreatingQuestion] = useState(false);
const [editingQuestion, setEditingQuestion] = useState(null);

  // =========================================================
  // FETCH USERS
  // =========================================================
  useEffect(() => {
    if (activePage !== "Users") {
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        setUserError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5001/api/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch users"
          );
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

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================
  useEffect(() => {
    if (
  activePage !== "Categories" &&
  activePage !== "Questions"
) {
  return;
}

    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoryError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5001/api/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch categories"
          );
        }

        setCategories(data.categories);
      } catch (error) {
        setCategoryError(error.message);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [activePage]);

  // =========================================================
  // FETCH QUIZZES
  // =========================================================
  useEffect(() => {
    if (activePage !== "Quizzes" && activePage !== "Questions") {
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
          throw new Error(
            data.message || "Failed to fetch quizzes"
          );
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



useEffect(() => {
  if (!selectedQuizId) {
    setQuestionList([]);
    return;
  }

  const fetchQuestions = async () => {
    try {
      setLoadingQuestions(true);
      setQuestionError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5001/api/questions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch questions"
        );
      }

      // Only show questions belonging to selected quiz
      const filteredQuestions = data.questions.filter(
        (question) =>
          String(question.quiz_id) === String(selectedQuizId)
      );

      setQuestionList(filteredQuestions);

    } catch (error) {
      console.error("Fetch questions error:", error);
      setQuestionError(error.message);
    } finally {
      setLoadingQuestions(false);
    }
  };

  fetchQuestions();
}, [selectedQuizId]);

  // =========================================================
  // NAVIGATION
  // =========================================================
  const handleNavigation = (page) => {
    setActivePage(page);
  };

  // =========================================================
  // PUBLISH / UNPUBLISH QUIZ
  // =========================================================
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
        throw new Error(
          data.message || "Failed to update quiz status"
        );
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

  // =========================================================
  // DELETE QUIZ
  // =========================================================
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

  const handleEditQuestion = (question) => {
  setEditingQuestion(question);

  setQuestionText(question.question_text);
  setSelectedCategoryId(
    question.category_id
      ? String(question.category_id)
      : ""
  );

  setQuestionOptions(
    question.options.map((option) => ({
      option_text: option.option_text,
      is_correct: option.is_correct,
    }))
  );

  setShowQuestionForm(true);
};

const handleDeleteQuestion = async (questionId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this question?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5001/api/questions/${questionId}`,
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
        data.message || "Failed to delete question"
      );
    }

    console.log("Question deleted:", data);

    // Remove the deleted question from the screen
    setQuestionList((previousQuestions) =>
      previousQuestions.filter(
        (question) => question.id !== questionId
      )
    );

  } catch (error) {
    console.error("Delete question error:", error);

    setQuestionError(error.message);
  }
};


  // =========================================================
  // RETURN
  // =========================================================
  return (
    <div className="admin-dashboard">

      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">

        <h2>QuizPlatform</h2>

        <nav>

          <button
            className={
              activePage === "Dashboard" ? "active" : ""
            }
            onClick={() => handleNavigation("Dashboard")}
          >
            Dashboard
          </button>

          <button
            className={
              activePage === "Users" ? "active" : ""
            }
            onClick={() => handleNavigation("Users")}
          >
            Users
          </button>

          <button
            className={
              activePage === "Quizzes" ? "active" : ""
            }
            onClick={() => handleNavigation("Quizzes")}
          >
            Quizzes
          </button>

          <button
            className={
              activePage === "Categories" ? "active" : ""
            }
            onClick={() => handleNavigation("Categories")}
          >
            Categories
          </button>

          <button
            className={
              activePage === "Questions" ? "active" : ""
            }
            onClick={() => handleNavigation("Questions")}
          >
            Questions
          </button>

          <button
            className={
              activePage === "Results" ? "active" : ""
            }
            onClick={() => handleNavigation("Results")}
          >
            Results
          </button>

        </nav>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>

      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="dashboard-content">

        {/* ================= HEADER ================= */}
        <header className="dashboard-header">

          <h1>{activePage}</h1>

          <p>
            {activePage === "Dashboard"
              ? "Welcome to QuizPlatform Admin Panel"
              : `${activePage} section`}
          </p>

        </header>

        {/* =====================================================
            DASHBOARD
        ====================================================== */}
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

        {/* =====================================================
            USERS
        ====================================================== */}
        {activePage === "Users" && (
          <section className="user-management">

            <h2>User Management</h2>

            {loadingUsers && (
              <p>Loading users...</p>
            )}

            {userError && (
              <p className="error-message">
                {userError}
              </p>
            )}

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

                        <td>
                          {user.status
                            ? "Active"
                            : "Inactive"}
                        </td>

                        <td>
                          {new Date(
                            user.created_at
                          ).toLocaleDateString()}
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </section>
        )}

        {/* =====================================================
            QUIZZES
        ====================================================== */}
        {activePage === "Quizzes" && (
          <section className="quiz-management">

            <div className="quiz-management-header">

              <h2>Quiz Management</h2>

              <button
                className="create-quiz-button"
                onClick={() => setShowQuizForm(true)}
              >
                + Create Quiz
              </button>

            </div>

            {/* ================= CREATE QUIZ FORM ================= */}
            {showQuizForm && (
              <div className="quiz-form">

                <h3>Create Quiz</h3>

                <input
                  type="text"
                  placeholder="Quiz title"
                  value={quizTitle}
                  onChange={(e) =>
                    setQuizTitle(e.target.value)
                  }
                />

                <textarea
                  placeholder="Quiz description"
                  value={quizDescription}
                  onChange={(e) =>
                    setQuizDescription(e.target.value)
                  }
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

                        const token =
                          localStorage.getItem("token");

                        const response =
                          await fetch(
                            "http://localhost:5001/api/quizzes",
                            {
                              method: "POST",
                              headers: {
                                "Content-Type":
                                  "application/json",
                                Authorization:
                                  `Bearer ${token}`,
                              },
                              body: JSON.stringify({
                                title: quizTitle,
                                description:
                                  quizDescription,
                              }),
                            }
                          );

                        const data =
                          await response.json();

                        if (!response.ok) {
                          throw new Error(
                            data.message ||
                              "Failed to create quiz"
                          );
                        }

                        setQuizzes(
                          (previousQuizzes) => [
                            data.quiz,
                            ...previousQuizzes,
                          ]
                        );

                        setQuizTitle("");
                        setQuizDescription("");
                        setShowQuizForm(false);

                      } catch (error) {

                        setQuizError(
                          error.message
                        );

                      } finally {

                        setCreatingQuiz(false);

                      }

                    }}
                  >
                    {creatingQuiz
                      ? "Creating..."
                      : "Create Quiz"}
                  </button>

                </div>

              </div>
            )}

            {/* ================= EDIT QUIZ FORM ================= */}
            {editingQuiz && (
              <div className="quiz-form">

                <h3>Edit Quiz</h3>

                <input
                  type="text"
                  placeholder="Quiz title"
                  value={quizTitle}
                  onChange={(e) =>
                    setQuizTitle(e.target.value)
                  }
                />

                <textarea
                  placeholder="Quiz description"
                  value={quizDescription}
                  onChange={(e) =>
                    setQuizDescription(e.target.value)
                  }
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

                        const token =
                          localStorage.getItem("token");

                        const response =
                          await fetch(
                            `http://localhost:5001/api/quizzes/${editingQuiz.id}`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type":
                                  "application/json",
                                Authorization:
                                  `Bearer ${token}`,
                              },
                              body: JSON.stringify({
                                title: quizTitle,
                                description:
                                  quizDescription,
                              }),
                            }
                          );

                        const data =
                          await response.json();

                        if (!response.ok) {
                          throw new Error(
                            data.message ||
                              "Failed to update quiz"
                          );
                        }

                        setQuizzes(
                          (previousQuizzes) =>
                            previousQuizzes.map(
                              (quiz) =>
                                quiz.id ===
                                editingQuiz.id
                                  ? data.quiz
                                  : quiz
                            )
                        );

                        setEditingQuiz(null);
                        setQuizTitle("");
                        setQuizDescription("");

                      } catch (error) {

                        setQuizError(
                          error.message
                        );

                      } finally {

                        setUpdatingQuiz(false);

                      }

                    }}
                  >
                    {updatingQuiz
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>

              </div>
            )}

            {loadingQuizzes && (
              <p>Loading quizzes...</p>
            )}

            {quizError && (
              <p className="error-message">
                {quizError}
              </p>
            )}

            {!loadingQuizzes && !quizError && (
              <div className="quiz-list">

                {quizzes.length === 0 ? (
                  <p>No quizzes found.</p>
                ) : (

                  quizzes.map((quiz) => (

                    <div
                      className="quiz-card"
                      key={quiz.id}
                    >

                      <div className="quiz-card-content">

                        <h3>{quiz.title}</h3>

                        <p>
                          {quiz.description ||
                            "No description available."}
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
                            setQuizTitle(
                              quiz.title
                            );
                            setQuizDescription(
                              quiz.description || ""
                            );
                          }}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteQuiz(quiz)
                          }
                        >
                          Delete
                        </button>

                        <button
                          onClick={() =>
                            handlePublishQuiz(quiz)
                          }
                        >
                          {quiz.is_published
                            ? "Unpublish"
                            : "Publish"}
                        </button>

                      </div>

                    </div>

                  ))

                )}

              </div>
            )}

          </section>
        )}

        {/* =====================================================
            CATEGORIES
        ====================================================== */}
        {activePage === "Categories" && (
          <section className="category-management">

          <div className="section-header">
            <h2>Category Management</h2>

            <button className="create-quiz-button" onClick={() => setShowCategoryForm(true)}>
              + Add Category
            </button>
          </div>

          {showCategoryForm && (
  <div className="quiz-form">

    <h3>Add Category</h3>

    <input
      type="text"
      placeholder="Category name"
      value={categoryName}
      onChange={(e) => setCategoryName(e.target.value)}
    />

    <textarea
      placeholder="Category description"
      value={categoryDescription}
      onChange={(e) =>
        setCategoryDescription(e.target.value)
      }
    />

    <div className="quiz-form-actions">

      <button
        type="button"
        onClick={() => {
          setShowCategoryForm(false);
          setCategoryName("");
          setCategoryDescription("");
        }}
      >
        Cancel
      </button>

      <button
        type="button"
        disabled={creatingCategory}
        onClick={async () => {
          try {
            setCreatingCategory(true);
            setCategoryError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
              "http://localhost:5001/api/categories",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  name: categoryName,
                  description: categoryDescription,
                }),
              }
            );

            const data = await response.json();

            if (!response.ok) {
              throw new Error(
                data.message || "Failed to create category"
              );
            }

            setCategories((previousCategories) => [
              data.category,
              ...previousCategories,
            ]);

            setCategoryName("");
            setCategoryDescription("");
            setShowCategoryForm(false);

          } catch (error) {
            setCategoryError(error.message);
          } finally {
            setCreatingCategory(false);
          }
        }}
      >
        {creatingCategory ? "Creating..." : "Create Category"}
      </button>

    </div>
  </div>
)}

      {editingCategory && (
  <div className="quiz-form">

    <h3>Edit Category</h3>

    <input
      type="text"
      placeholder="Category name"
      value={categoryName}
      onChange={(e) =>
        setCategoryName(e.target.value)
      }
    />

    <textarea
      placeholder="Category description"
      value={categoryDescription}
      onChange={(e) =>
        setCategoryDescription(e.target.value)
      }
    />

    <div className="quiz-form-actions">

      <button
        type="button"
        onClick={() => {
          setEditingCategory(null);
          setCategoryName("");
          setCategoryDescription("");
        }}
      >
        Cancel
      </button>

      <button
        type="button"
        disabled={updatingCategory}
        onClick={async () => {
          try {
            setUpdatingCategory(true);
            setCategoryError("");

            const token =
              localStorage.getItem("token");

            const response = await fetch(
              `http://localhost:5001/api/categories/${editingCategory.id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  name: categoryName,
                  description: categoryDescription,
                }),
              }
            );

            const data = await response.json();

            if (!response.ok) {
              throw new Error(
                data.message ||
                  "Failed to update category"
              );
            }

            setCategories(
              (previousCategories) =>
                previousCategories.map((category) =>
                  category.id === editingCategory.id
                    ? data.category
                    : category
                )
            );

            setEditingCategory(null);
            setCategoryName("");
            setCategoryDescription("");

          } catch (error) {
            setCategoryError(error.message);
          } finally {
            setUpdatingCategory(false);
          }
        }}
      >
        {updatingCategory
          ? "Saving..."
          : "Save Changes"}
      </button>

    </div>

  </div>
)}

            {loadingCategories && (
              <p>Loading categories...</p>
            )}

            {categoryError && (
              <p className="error-message">
                {categoryError}
              </p>
            )}

            {!loadingCategories &&
              !categoryError && (
                <div className="categories-table-container">

                  <table className="categories-table">

                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>

                      {categories.length === 0 ? (
                        <tr>
                          <td colSpan="6">
                            No categories found.
                          </td>
                        </tr>
                      ) : (

                        categories.map((category) => (

                          <tr key={category.id}>

                            <td>
                              {category.id}
                            </td>

                            <td>
                              {category.name}
                            </td>

                            <td>
                              {category.description}
                            </td>

                            <td>
                              {new Date(
                                category.created_at
                              ).toLocaleDateString()}
                            </td>

                            <td>
                              {new Date(
                                category.updated_at
                              ).toLocaleDateString()}
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                setEditingCategory(category);
                                setCategoryName(category.name);
                                setCategoryDescription(category.description || "");
                              }}
                              >
                              Edit
                              </button>

                              <button
                                onClick={async () => {
                                const confirmDelete = window.confirm(
                                `Are you sure you want to delete "${category.name}"?`
                                );

                              if (!confirmDelete) {
                                return;
                              }

                              try {
                                setCategoryError("");

                                const token = localStorage.getItem("token");

                                const response = await fetch(
                                `http://localhost:5001/api/categories/${category.id}`,
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
                                    data.message || "Failed to delete category"
                                    );
                                  }

                                setCategories((previousCategories) =>
                                previousCategories.filter(
                                  (item) => item.id !== category.id
                                  )
                                );

                              } catch (error) {
                                setCategoryError(error.message);
                                }
                              }}
                              >
                              Delete
                            </button>
                            </td>

                          </tr>

                        ))

                      )}

                    </tbody>

                  </table>

                </div>
              )}

          </section>
        )}  

        {activePage === "Questions" && (
  <section className="question-management">

    {/* 1. Heading + Add Question button */}
    <div className="section-header">
      <h2>Question Management</h2>

      {selectedQuizId && (
        <button
          className="create-quiz-button"
          onClick={() => setShowQuestionForm(true)}
        >
          + Add Question
        </button>
      )}
    </div>

    {/* 2. Quiz dropdown */}
    <div className="question-quiz-selector">

      <label htmlFor="quiz-select">
        Select Quiz
      </label>

      <select
        id="quiz-select"
        value={selectedQuizId}
        onChange={(e) => {
          setSelectedQuizId(e.target.value);
          setQuestionList([]);
          setQuestionError("");
        }}
      >
        <option value="">
          -- Select a Quiz --
        </option>

        {quizzes.map((quiz) => (
          <option key={quiz.id} value={quiz.id}>
            {quiz.title}
          </option>
        ))}
      </select>

    </div>

    {/* 3. ADD QUESTION FORM GOES HERE */}
    {showQuestionForm && (
      <div className="quiz-form">

        <h3>
  {editingQuestion
    ? "Edit Question"
    : "Add Question"}
</h3>

        <label>Category</label>

        <select
          value={selectedCategoryId}
          onChange={(e) =>
            setSelectedCategoryId(e.target.value)
          }
        >
          <option value="">
            -- Select Category --
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <label>Question</label>

        <textarea
          placeholder="Enter question"
          value={questionText}
          onChange={(e) =>
            setQuestionText(e.target.value)
          }
        />

        <label>Options</label>

        {questionOptions.map((option, index) => (
          <div
            key={index}
            className="question-option-row"
          >
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option.option_text}
              onChange={(e) => {
                const updatedOptions = [
                  ...questionOptions,
                ];

                updatedOptions[index] = {
                  ...updatedOptions[index],
                  option_text: e.target.value,
                };

                setQuestionOptions(updatedOptions);
              }}
            />

            <label>
              <input
                type="radio"
                name="correct-answer"
                checked={option.is_correct}
                onChange={() => {
                  const updatedOptions =
                    questionOptions.map(
                      (item, optionIndex) => ({
                        ...item,
                        is_correct:
                          optionIndex === index,
                      })
                    );

                  setQuestionOptions(updatedOptions);
                }}
              />

              Correct
            </label>
          </div>
        ))}

        <div className="quiz-form-actions">

          <button
            type="button"
            onClick={() => setShowQuestionForm(false)}
          >
            Cancel
          </button>

          <button
  type="button"
  disabled={creatingQuestion}
  onClick={async () => {
  try {
    setCreatingQuestion(true);
    setQuestionError("");

    if (!questionText.trim()) {
      throw new Error("Question text is required");
    }

    if (!selectedCategoryId) {
      throw new Error("Please select a category");
    }

    const hasEmptyOption = questionOptions.some(
      (option) => !option.option_text.trim()
    );

    if (hasEmptyOption) {
      throw new Error("Please fill all four options");
    }

    const correctCount = questionOptions.filter(
      (option) => option.is_correct
    ).length;

    if (correctCount !== 1) {
      throw new Error(
        "Please select exactly one correct answer"
      );
    }

    const token = localStorage.getItem("token");

    const url = editingQuestion
      ? `http://localhost:5001/api/questions/${editingQuestion.id}`
      : "http://localhost:5001/api/questions";

    const response = await fetch(url, {
      method: editingQuestion ? "PUT" : "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        ...(editingQuestion
          ? {}
          : {
              quiz_id: Number(selectedQuizId),
            }),

        category_id: Number(selectedCategoryId),

        question_text: questionText.trim(),

        options: questionOptions.map((option) => ({
          option_text: option.option_text.trim(),
          is_correct: option.is_correct,
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to save question"
      );
    }

    console.log(
      editingQuestion
        ? "Question updated:"
        : "Question created:",
      data
    );

    // Update question in the displayed list
    if (editingQuestion) {
      setQuestionList((previousQuestions) =>
        previousQuestions.map((question) =>
          question.id === editingQuestion.id
            ? {
                ...data.question,
                options: data.options,
              }
            : question
        )
      );
    } else {
      setQuestionList((previousQuestions) => [
        {
          ...data.question,
          options: data.options,
        },
        ...previousQuestions,
      ]);
    }

    // Reset form
    setQuestionText("");
    setSelectedCategoryId("");

    setQuestionOptions([
      {
        option_text: "",
        is_correct: false,
      },
      {
        option_text: "",
        is_correct: false,
      },
      {
        option_text: "",
        is_correct: false,
      },
      {
        option_text: "",
        is_correct: false,
      },
    ]);

    setEditingQuestion(null);
    setShowQuestionForm(false);

  } catch (error) {
    console.error("Save question error:", error);
    setQuestionError(error.message);
  } finally {
    setCreatingQuestion(false);
  }
}}
>
  {creatingQuestion
  ? editingQuestion
    ? "Updating..."
    : "Creating..."
  : editingQuestion
    ? "Update Question"
    : "Create Question"}
</button>

        </div>

      </div>
    )}

    {selectedQuizId && (
  <div className="questions-list">

    {loadingQuestions && (
      <p>Loading questions...</p>
    )}

    {questionError && (
      <p className="error-message">
        {questionError}
      </p>
    )}

    {!loadingQuestions &&
      !questionError &&
      questionList.length === 0 && (
        <p>No questions found for this quiz.</p>
      )}

    {!loadingQuestions &&
      !questionError &&
      questionList.length > 0 && (
        <div>
          {questionList.map((question) => (
            <div className="question-card">
  <h3>{question.question_text}</h3>

  {question.options?.map((option) => (
    <p key={option.id}>
      {option.is_correct ? "✅" : "○"}{" "}
      {option.option_text}
    </p>
  ))}

  <div className="question-actions">
    <button
      type="button"
      onClick={() => handleEditQuestion(question)}
    >
      Edit
    </button>

    <button
      type="button"
      onClick={() => handleDeleteQuestion(question.id)}
    >
      Delete
    </button>
  </div>
</div>
          ))}
        </div>
      )}

  </div>
)}

    {/* 4. Question list comes AFTER the form */}
    {!selectedQuizId && (
      <p>
        Please select a quiz to manage its questions.
      </p>
    )}

    {selectedQuizId && (
      <div className="questions-list">
        {/* Your existing question list code */}
      </div>
    )}

  </section>
)}

        {/* =====================================================
            RESULTS
        ====================================================== */}
        {activePage === "Results" && (
          <section className="dashboard-placeholder">

            <h2>Results</h2>

            <p>
              Quiz results will appear here.
            </p>

          </section>
        )}

      </main>

    </div>
  );
}

export default AdminDashboard;