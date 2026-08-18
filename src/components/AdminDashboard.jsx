import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard({ onLogout }) {
  // =========================================================
  // PAGE
  // =========================================================

  const [activePage, setActivePage] = useState("Dashboard");

  // =========================================================
  // USERS
  // =========================================================

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState("");

  // =========================================================
  // QUIZZES
  // =========================================================

  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [quizError, setQuizError] = useState("");

  const [showQuizForm, setShowQuizForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");

  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [updatingQuiz, setUpdatingQuiz] = useState(false);
  // =========================================================
  // CATEGORIES
  // =========================================================

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] =
    useState("");

  const [creatingCategory, setCreatingCategory] =
    useState(false);

  const [updatingCategory, setUpdatingCategory] =
    useState(false);

  // =========================================================
  // QUESTIONS
  // =========================================================

  const [selectedQuizId, setSelectedQuizId] = useState("");

  const [questionList, setQuestionList] = useState([]);
  const [loadingQuestions, setLoadingQuestions] =
    useState(false);
  const [questionError, setQuestionError] =
    useState("");

  const [showQuestionForm, setShowQuestionForm] =
    useState(false);

  const [editingQuestion, setEditingQuestion] =
    useState(null);

  const [questionText, setQuestionText] =
    useState("");
const [questionExplanation, setQuestionExplanation] =
  useState("");
  const [selectedCategoryId, setSelectedCategoryId] =
    useState("");

    // =========================================================
// LEADERBOARD
// =========================================================

const [leaderboard, setLeaderboard] = useState([]);
const [loadingLeaderboard, setLoadingLeaderboard] =
  useState(false);
const [leaderboardError, setLeaderboardError] =
  useState("");

  const [categoryLeaderboards, setCategoryLeaderboards] =
  useState([]);

const [selectedLeaderboardCategory, setSelectedLeaderboardCategory] =
  useState("");

const [loadingCategoryLeaderboard, setLoadingCategoryLeaderboard] =
  useState(false);

const [categoryLeaderboardError, setCategoryLeaderboardError] =
  useState("");

  const emptyOptions = [
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
  ];

  const [questionOptions, setQuestionOptions] =
    useState(emptyOptions);

  const [creatingQuestion, setCreatingQuestion] =
    useState(false);

  // =========================================================
  // RESULTS
  // =========================================================

  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] =
    useState(false);
  const [resultError, setResultError] =
    useState("");

  // =========================================================
  // COMMON
  // =========================================================

  const token = localStorage.getItem("token");

  // =========================================================
  // RESET QUESTION FORM
  // =========================================================

  const resetQuestionForm = () => {
    setQuestionText("");
    setQuestionExplanation("");
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
  };

  // =========================================================
  // RESET QUIZ FORM
  // =========================================================

  const resetQuizForm = () => {
  setQuizTitle("");
  setQuizDescription("");
  setDurationMinutes("");
  setEditingQuiz(null);
  setShowQuizForm(false);
};

  // =========================================================
  // RESET CATEGORY FORM
  // =========================================================

  const resetCategoryForm = () => {
    setCategoryName("");
    setCategoryDescription("");
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  // =========================================================
  // FETCH USERS
  // =========================================================

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      setUserError("");

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

      setUsers(data.users || []);
    } catch (error) {
      console.error("Fetch users error:", error);
      setUserError(error.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  // =========================================================
  // FETCH QUIZZES
  // =========================================================

  const fetchQuizzes = async () => {
    try {
      setLoadingQuizzes(true);
      setQuizError("");

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

      setQuizzes(data.quizzes || []);
    } catch (error) {
      console.error("Fetch quizzes error:", error);
      setQuizError(error.message);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      setCategoryError("");

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

      setCategories(data.categories || []);
    } catch (error) {
      console.error(
        "Fetch categories error:",
        error
      );

      setCategoryError(error.message);
    } finally {
      setLoadingCategories(false);
    }
  };

  // =========================================================
  // FETCH QUESTIONS
  // =========================================================

  const fetchQuestions = async (quizId) => {
    if (!quizId) {
      setQuestionList([]);
      return;
    }

    try {
      setLoadingQuestions(true);
      setQuestionError("");

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
          data.message ||
            "Failed to fetch questions"
        );
      }

      const filteredQuestions =
        (data.questions || []).filter(
          (question) =>
            String(question.quiz_id) ===
            String(quizId)
        );

      setQuestionList(filteredQuestions);
    } catch (error) {
      console.error(
        "Fetch questions error:",
        error
      );

      setQuestionError(error.message);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // =========================================================
  // FETCH RESULTS
  // =========================================================
  //
  // This expects:
  //
  // GET /api/quizzes/results
  //
  // Example response:
  //
  // {
  //   results: [...]
  // }
  //
  // =========================================================
const fetchResults = async () => {
  try {
    setLoadingResults(true);
    setResultError("");

    const response = await fetch(
      "http://localhost:5001/api/quizzes/results",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Read response as text first
    const responseText = await response.text();

    console.log("Results API status:", response.status);
    console.log("Results API response:", responseText);

    if (!response.ok) {
      throw new Error(
        `Results API error (${response.status}): ${responseText}`
      );
    }

    let data;

    try {
      data = JSON.parse(responseText);
    } catch (error) {
      throw new Error(
        "Results API did not return JSON. Check the backend route."
      );
    }

    setResults(data.results || []);
  } catch (error) {
    console.error("Fetch results error:", error);
    setResultError(error.message);
  } finally {
    setLoadingResults(false);
  }
};

const fetchOverallLeaderboard = async () => {
  try {
    setLoadingLeaderboard(true);
    setLeaderboardError("");

    const response = await fetch(
      "http://localhost:5001/api/quizzes/leaderboard/overall",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to fetch leaderboard"
      );
    }

    setLeaderboard(data.leaderboard || []);
  } catch (error) {
    console.error(
      "Fetch leaderboard error:",
      error
    );

    setLeaderboardError(error.message);
  } finally {
    setLoadingLeaderboard(false);
  }
};

const fetchCategoryLeaderboard = async () => {
  try {
    setLoadingCategoryLeaderboard(true);
    setCategoryLeaderboardError("");

    const response = await fetch(
      "http://localhost:5001/api/quizzes/leaderboard/category",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to fetch category leaderboard"
      );
    }

    const categories = data.categories || [];

    setCategoryLeaderboards(categories);

    // Automatically select first category
    if (
      categories.length > 0 &&
      !selectedLeaderboardCategory
    ) {
      setSelectedLeaderboardCategory(
        String(categories[0].category_id)
      );
    }
  } catch (error) {
    console.error(
      "Fetch category leaderboard error:",
      error
    );

    setCategoryLeaderboardError(
      error.message
    );
  } finally {
    setLoadingCategoryLeaderboard(false);
  }
};

  // =========================================================
  // INITIAL / PAGE DATA
  // =========================================================

  useEffect(() => {
    if (activePage === "Dashboard") {
      fetchUsers();
      fetchQuizzes();
      fetchResults();
      fetchOverallLeaderboard();
      fetchCategoryLeaderboard();
    }

    if (activePage === "Users") {
      fetchUsers();
    }

    if (activePage === "Quizzes") {
      fetchQuizzes();
    }

    if (activePage === "Categories") {
      fetchCategories();
    }

    if (activePage === "Questions") {
      fetchQuizzes();
      fetchCategories();
    }

    if (activePage === "Results") {
      fetchResults();
    }
  }, [activePage]);

  // =========================================================
  // QUESTION SELECTION
  // =========================================================

  useEffect(() => {
    if (!selectedQuizId) {
      setQuestionList([]);
      return;
    }

    fetchQuestions(selectedQuizId);
  }, [selectedQuizId]);

  // =========================================================
  // NAVIGATION
  // =========================================================

  const handleNavigation = (page) => {
    setActivePage(page);
  };

  // =========================================================
  // CREATE QUIZ
  // =========================================================

  const handleCreateQuiz = async () => {
    try {
      setCreatingQuiz(true);
      setQuizError("");

      if (!quizTitle.trim()) {
        throw new Error(
          "Quiz title is required"
        );
      }
     if (
  !durationMinutes ||
  Number(durationMinutes) <= 0
) {
  throw new Error(
    "Quiz duration must be greater than 0 minutes"
  );
}
      const response = await fetch(
        "http://localhost:5001/api/quizzes",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
  title: quizTitle.trim(),
  description: quizDescription.trim(),
  duration_minutes: Number(durationMinutes),
}),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create quiz"
        );
      }

      setQuizzes((previousQuizzes) => [
        data.quiz,
        ...previousQuizzes,
      ]);

      resetQuizForm();
    } catch (error) {
      console.error(
        "Create quiz error:",
        error
      );

      setQuizError(error.message);
    } finally {
      setCreatingQuiz(false);
    }
  };

  // =========================================================
  // EDIT QUIZ
  // =========================================================

  const handleStartEditQuiz = (quiz) => {
  setEditingQuiz(quiz);

  setQuizTitle(quiz.title || "");
  setQuizDescription(quiz.description || "");

  setDurationMinutes(
    quiz.duration_minutes
      ? String(quiz.duration_minutes)
      : ""
  );

  setShowQuizForm(true);
};

  // =========================================================
  // UPDATE QUIZ
  // =========================================================

  const handleUpdateQuiz = async () => {
    if (!editingQuiz) {
      return;
    }

    try {
      setUpdatingQuiz(true);
      setQuizError("");

      if (!quizTitle.trim()) {
        throw new Error(
          "Quiz title is required"
        );
      }
      if (
  !durationMinutes ||
  Number(quizDuration) <= 0
) {
  throw new Error(
    "Quiz duration must be greater than 0 minutes"
  );
}

      const response = await fetch(
        `http://localhost:5001/api/quizzes/${editingQuiz.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
  title: quizTitle.trim(),
  description: quizDescription.trim(),
  duration_minutes: Number(quizDuration),
}),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update quiz"
        );
      }

      setQuizzes((previousQuizzes) =>
        previousQuizzes.map((quiz) =>
          quiz.id === editingQuiz.id
            ? data.quiz
            : quiz
        )
      );

      resetQuizForm();
    } catch (error) {
      console.error(
        "Update quiz error:",
        error
      );

      setQuizError(error.message);
    } finally {
      setUpdatingQuiz(false);
    }
  };

  // =========================================================
  // DELETE QUIZ
  // =========================================================

  const handleDeleteQuiz = async (quiz) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${quiz.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setQuizError("");

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
          data.message ||
            "Failed to delete quiz"
        );
      }

      setQuizzes((previousQuizzes) =>
        previousQuizzes.filter(
          (item) =>
            item.id !== quiz.id
        )
      );

      if (
        String(selectedQuizId) ===
        String(quiz.id)
      ) {
        setSelectedQuizId("");
        setQuestionList([]);
      }
    } catch (error) {
      console.error(
        "Delete quiz error:",
        error
      );

      setQuizError(error.message);
    }
  };

  // =========================================================
  // PUBLISH / UNPUBLISH QUIZ
  // =========================================================

  const handlePublishQuiz = async (quiz) => {
    try {
      setQuizError("");

      const response = await fetch(
        `http://localhost:5001/api/quizzes/${quiz.id}/publish`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            is_published:
              !quiz.is_published,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update quiz status"
        );
      }

      setQuizzes((previousQuizzes) =>
        previousQuizzes.map((item) =>
          item.id === quiz.id
            ? data.quiz
            : item
        )
      );
    } catch (error) {
      console.error(
        "Publish quiz error:",
        error
      );

      setQuizError(error.message);
    }
  };

  // =========================================================
  // CREATE CATEGORY
  // =========================================================

  const handleCreateCategory = async () => {
    try {
      setCreatingCategory(true);
      setCategoryError("");

      if (!categoryName.trim()) {
        throw new Error(
          "Category name is required"
        );
      }

      const response = await fetch(
        "http://localhost:5001/api/categories",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: categoryName.trim(),
            description:
              categoryDescription.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create category"
        );
      }

      setCategories(
        (previousCategories) => [
          data.category,
          ...previousCategories,
        ]
      );

      resetCategoryForm();
    } catch (error) {
      console.error(
        "Create category error:",
        error
      );

      setCategoryError(error.message);
    } finally {
      setCreatingCategory(false);
    }
  };

  // =========================================================
  // EDIT CATEGORY
  // =========================================================

  const handleStartEditCategory = (
    category
  ) => {
    setEditingCategory(category);

    setCategoryName(
      category.name || ""
    );

    setCategoryDescription(
      category.description || ""
    );

    setShowCategoryForm(true);
  };

  // =========================================================
  // UPDATE CATEGORY
  // =========================================================

  const handleUpdateCategory = async () => {
    if (!editingCategory) {
      return;
    }

    try {
      setUpdatingCategory(true);
      setCategoryError("");

      if (!categoryName.trim()) {
        throw new Error(
          "Category name is required"
        );
      }

      const response = await fetch(
        `http://localhost:5001/api/categories/${editingCategory.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: categoryName.trim(),
            description:
              categoryDescription.trim(),
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
          previousCategories.map(
            (category) =>
              category.id ===
              editingCategory.id
                ? data.category
                : category
          )
      );

      resetCategoryForm();
    } catch (error) {
      console.error(
        "Update category error:",
        error
      );

      setCategoryError(error.message);
    } finally {
      setUpdatingCategory(false);
    }
  };

  // =========================================================
  // DELETE CATEGORY
  // =========================================================

  const handleDeleteCategory = async (
    category
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setCategoryError("");

      const response = await fetch(
        `http://localhost:5001/api/categories/${category.id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete category"
        );
      }

      setCategories(
        (previousCategories) =>
          previousCategories.filter(
            (item) =>
              item.id !== category.id
          )
      );
    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      setCategoryError(error.message);
    }
  };

  // =========================================================
  // EDIT QUESTION
  // =========================================================

  const handleEditQuestion = (
    question
  ) => {
    setEditingQuestion(question);

    setQuestionText(
      question.question_text || ""
    );

    setQuestionExplanation(
  question.explanation || ""
);

    setSelectedCategoryId(
      question.category_id
        ? String(question.category_id)
        : ""
    );

    setQuestionOptions(
      question.options?.map(
        (option) => ({
          option_text:
            option.option_text || "",
          is_correct:
            Boolean(option.is_correct),
        })
      ) || [
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
      ]
    );

    setShowQuestionForm(true);
  };

  // =========================================================
  // SAVE QUESTION
  // =========================================================

  const handleSaveQuestion = async () => {
    try {
      setCreatingQuestion(true);
      setQuestionError("");

      if (!selectedQuizId) {
        throw new Error(
          "Please select a quiz"
        );
      }

      if (!questionText.trim()) {
        throw new Error(
          "Question text is required"
        );
      }

      if (!selectedCategoryId) {
        throw new Error(
          "Please select a category"
        );
      }

      const hasEmptyOption =
        questionOptions.some(
          (option) =>
            !option.option_text.trim()
        );

      if (hasEmptyOption) {
        throw new Error(
          "Please fill all four options"
        );
      }

      const correctCount =
        questionOptions.filter(
          (option) =>
            option.is_correct
        ).length;

      if (correctCount !== 1) {
        throw new Error(
          "Please select exactly one correct answer"
        );
      }

      const url = editingQuestion
        ? `http://localhost:5001/api/questions/${editingQuestion.id}`
        : "http://localhost:5001/api/questions";

      const method = editingQuestion
        ? "PUT"
        : "POST";

      const body = {
        category_id:
          Number(selectedCategoryId),

        question_text:
          questionText.trim(),

          explanation: questionExplanation.trim(),

        options:
          questionOptions.map(
            (option) => ({
              option_text:
                option.option_text.trim(),

              is_correct:
                option.is_correct,
            })
          ),
      };

      if (!editingQuestion) {
        body.quiz_id =
          Number(selectedQuizId);
      }

      const response = await fetch(
        url,
        {
          method,

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save question"
        );
      }

      const savedQuestion = {
        ...data.question,
        options:
          data.options ||
          data.question?.options ||
          [],
      };

      if (editingQuestion) {
        setQuestionList(
          (previousQuestions) =>
            previousQuestions.map(
              (question) =>
                question.id ===
                editingQuestion.id
                  ? savedQuestion
                  : question
            )
        );
      } else {
        setQuestionList(
          (previousQuestions) => [
            savedQuestion,
            ...previousQuestions,
          ]
        );
      }

      resetQuestionForm();
    } catch (error) {
      console.error(
        "Save question error:",
        error
      );

      setQuestionError(error.message);
    } finally {
      setCreatingQuestion(false);
    }
  };

  // =========================================================
  // DELETE QUESTION
  // =========================================================

  const handleDeleteQuestion = async (
    questionId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setQuestionError("");

      const response = await fetch(
        `http://localhost:5001/api/questions/${questionId}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete question"
        );
      }

      setQuestionList(
        (previousQuestions) =>
          previousQuestions.filter(
            (question) =>
              question.id !== questionId
          )
      );
    } catch (error) {
      console.error(
        "Delete question error:",
        error
      );

      setQuestionError(error.message);
    }
  };

  // =========================================================
// DAY 11 - ADMIN ANALYTICS
// =========================================================

const studentUsers = users.filter(
  (user) =>
    String(user.role).toUpperCase() ===
    "STUDENT"
);



const totalStudents = studentUsers.length;

const activeStudents = studentUsers.filter(
  (user) => user.status === true
).length;

const attemptedStudentIds = new Set(
  results
    .map((result) =>
      Number(result.student_id)
    )
    .filter((id) =>
      Number.isInteger(id)
    )
);

const studentsAttempted =
  attemptedStudentIds.size;

  // =========================================================
// ATTEMPTS PER QUIZ
// =========================================================

const attemptsPerQuiz = results.reduce(
  (quizAttempts, result) => {

    const quizId = result.quiz_id;

    const quizTitle =
      result.quiz_title ||
      result.title ||
      "Unknown Quiz";

    const existingQuiz =
      quizAttempts.find(
        (item) =>
          String(item.quiz_id) ===
          String(quizId)
      );

    if (existingQuiz) {
      existingQuiz.attempts += 1;
      
    } else {
      quizAttempts.push({
        quiz_id: quizId,
        quiz_title: quizTitle,
        attempts: 1,
      });
    }

    return quizAttempts;
  },
  []
);
console.log(
  "ATTEMPTS PER QUIZ:",
  attemptsPerQuiz
);

// =========================================================
// ATTEMPT STATISTICS
// =========================================================

const totalAttempts = results.length;

const averageAttemptScore =
  totalAttempts > 0
    ? Math.round(
        results.reduce((sum, result) => {
          const score = Number(result.score) || 0;
          const total =
            Number(result.total_questions) || 0;

          const percentage =
            total > 0
              ? (score / total) * 100
              : 0;

          return sum + percentage;
        }, 0) / totalAttempts
      )
    : 0;

    // =========================================================
// PASS / FAIL ANALYTICS
// =========================================================

const passedAttempts = results.filter((result) => {
  const score = Number(result.score) || 0;
  const total =
    Number(result.total_questions) || 0;

  const percentage =
    total > 0
      ? (score / total) * 100
      : 0;

  return percentage >= 40;
}).length;

const failedAttempts =
  totalAttempts - passedAttempts;

const passPercentage =
  totalAttempts > 0
    ? Math.round(
        (passedAttempts / totalAttempts) * 100
      )
    : 0;

const failPercentage =
  totalAttempts > 0
    ? Math.round(
        (failedAttempts / totalAttempts) * 100
      )
    : 0;

    const selectedCategoryLeaderboard =
  categoryLeaderboards.find(
    (category) =>
      String(category.category_id) ===
      String(selectedLeaderboardCategory)
  );  

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="admin-dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="sidebar">

        <h2>QuizPlatform</h2>

        <nav>

          <button
            className={
              activePage === "Dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation("Dashboard")
            }
          >
            Dashboard
          </button>

          <button
            className={
              activePage === "Users"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation("Users")
            }
          >
            Users
          </button>

          <button
            className={
              activePage === "Quizzes"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation("Quizzes")
            }
          >
            Quizzes
          </button>

          <button
            className={
              activePage === "Categories"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation(
                "Categories"
              )
            }
          >
            Categories
          </button>

          <button
            className={
              activePage === "Questions"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation(
                "Questions"
              )
            }
          >
            Questions
          </button>

          <button
            className={
              activePage === "Results"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation("Results")
            }
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

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="dashboard-content">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="dashboard-header">

          <h1>{activePage}</h1>

          <p>
            {activePage ===
            "Dashboard"
              ? "Welcome to QuizPlatform Admin Panel"
              : `${activePage} section`}
          </p>

        </header>

        {/* ===================================================
            DASHBOARD
        =================================================== */}

        {activePage ===
          "Dashboard" && (
          <>

            <section className="dashboard-welcome">

              <div>

                <span className="dashboard-eyebrow">
                  ADMIN DASHBOARD
                </span>

                <h2>
                  Welcome back, Admin! 👋
                </h2>

                <p>
                  Manage quizzes,
                  students,
                  categories and
                  questions from one
                  place.
                </p>

              </div>

              <div className="dashboard-date">

                <span>
                  Today
                </span>

                <strong>
                  {new Date().toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </strong>

              </div>

            </section>

            <section className="statistics">

              <div className="stat-card">

  <div className="stat-icon stat-purple">
    👥
  </div>

  <h3>
    Total Students
  </h3>

  <p>
    {totalStudents}
  </p>

  <span className="stat-description">
    Registered students
  </span>

</div>
<div className="stat-card">

  <div className="stat-icon stat-green">
    ✓
  </div>

  <h3>
    Active Students
  </h3>

  <p>
    {activeStudents}
  </p>

  <span className="stat-description">
    Currently active
  </span>

</div>
<div className="stat-card">

  <div className="stat-icon stat-orange">
    📝
  </div>

  <h3>
    Students Attempted
  </h3>

  <p>
    {studentsAttempted}
  </p>

  <span className="stat-description">
    Attempted a quiz
  </span>

</div>

              <div className="stat-card">

                <div className="stat-icon stat-blue">
                  📚
                </div>

                <h3>
                  Total Quizzes
                </h3>

                <p>
                  {quizzes.length}
                </p>

                <span className="stat-description">
                  Created quizzes
                </span>

              </div>

              <div className="stat-card">

                <div className="stat-icon stat-green">
                  ✓
                </div>

                <h3>
                  Published Quizzes
                </h3>

                <p>
                  {
                    quizzes.filter(
                      (quiz) =>
                        quiz.is_published
                    ).length
                  }
                </p>

                <span className="stat-description">
                  Available to students
                </span>

              </div>

              <div className="stat-card">

                <div className="stat-icon stat-orange">
                  📝
                </div>

                <h3>
                  Results
                </h3>

                <p>
                  {results.length}
                </p>

                <span className="stat-description">
                  Quiz submissions
                </span>

              </div>

            </section>

            {/* =========================================
    ATTEMPTS PER QUIZ
========================================= */}

<section className="attempts-per-quiz-section">

  <div className="panel-heading">
    <div>
      <span className="panel-label">
        ATTEMPT ANALYTICS
      </span>

      <h3>
        Attempts Per Quiz
      </h3>
    </div>
  </div>
  <div className="attempt-summary-grid">

  <div className="attempt-summary-card">
    <span>Total Attempts</span>

    <strong>
      {totalAttempts}
    </strong>

    <p>
      All quiz submissions
    </p>
  </div>

  <div className="attempt-summary-card">
    <span>Average Score</span>

    <strong>
      {averageAttemptScore}%
    </strong>

    <p>
      Average across all attempts
    </p>
  </div>

</div>

  {attemptsPerQuiz.length === 0 ? (
    <p className="empty-dashboard">
      No quiz attempts available yet.
    </p>
  ) : (
    <div className="attempts-per-quiz-list">

      {attemptsPerQuiz.map((quiz) => (
        <div
          className="attempts-per-quiz-item"
          key={quiz.quiz_id}
        >

          <div className="attempts-quiz-info">
            <strong>
              {quiz.quiz_title}
            </strong>

            <span>
              {quiz.attempts} attempt
              {quiz.attempts !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="attempt-count-badge">
            {quiz.attempts}
          </div>

        </div>
      ))}

    </div>
  )}

</section>

{/* =========================================
    PASS / FAIL ANALYTICS
========================================= */}

<section className="pass-fail-section">

  <div className="panel-heading">
    <div>
      <span className="panel-label">
        RESULT ANALYTICS
      </span>

      <h3>Pass / Fail Analytics</h3>
    </div>
  </div>

  <div className="pass-fail-grid">

    <div className="pass-fail-card pass-card">
      <span>Passed</span>

      <strong>{passedAttempts}</strong>

      <p>
        {passPercentage}% of attempts
      </p>
    </div>

    <div className="pass-fail-card fail-card">
      <span>Failed</span>

      <strong>{failedAttempts}</strong>

      <p>
        {failPercentage}% of attempts
      </p>
    </div>

  </div>

</section>

{/* =========================================
    DAY 12 - OVERALL LEADERBOARD
========================================= */}

<section className="leaderboard-section">

  <div className="panel-heading">
    <div>
      <span className="panel-label">
        DAY 12
      </span>

      <h3>Overall Leaderboard</h3>
    </div>
  </div>

  {loadingLeaderboard && (
    <p className="empty-dashboard">
      Loading leaderboard...
    </p>
  )}

  {leaderboardError && (
    <p className="error-message">
      {leaderboardError}
    </p>
  )}

  {!loadingLeaderboard &&
    !leaderboardError &&
    leaderboard.length === 0 && (
      <p className="empty-dashboard">
        No leaderboard data available yet.
      </p>
    )}

  {!loadingLeaderboard &&
    !leaderboardError &&
    leaderboard.length > 0 && (
      <div className="leaderboard-table-wrapper">

        <table className="leaderboard-table">

          <thead>
            <tr>
              <th>Rank</th>
              <th>Student</th>
              <th>Attempts</th>
              <th>Average Score</th>
            </tr>
          </thead>

          <tbody>

            {leaderboard.map((student) => (
              <tr key={student.student_id}>

                <td>
                  <span
                    className={`leaderboard-rank rank-${student.rank}`}
                  >
                    {student.rank === 1
                      ? "🥇"
                      : student.rank === 2
                      ? "🥈"
                      : student.rank === 3
                      ? "🥉"
                      : `#${student.rank}`}
                  </span>
                </td>

                <td>
                  {student.student_name}
                </td>

                <td>
                  {student.total_attempts}
                </td>

                <td>
                  {student.average_percentage}%
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    )}

</section>  

{/* =========================================
    CATEGORY LEADERBOARD
========================================= */}

<section className="leaderboard-section">

  <div className="panel-heading">

    <div>
      <span className="panel-label">
        CATEGORY PERFORMANCE
      </span>

      <h3>
        Category Leaderboard
      </h3>
    </div>


    {categoryLeaderboards.length > 0 && (
      <select
        className="leaderboard-category-select"
        value={selectedLeaderboardCategory}
        onChange={(e) =>
          setSelectedLeaderboardCategory(
            e.target.value
          )
        }
      >

        {categoryLeaderboards.map(
          (category) => (
            <option
              key={category.category_id}
              value={category.category_id}
            >
              {category.category_name}
            </option>
          )
        )}

      </select>
    )}

  </div>


  {loadingCategoryLeaderboard && (
    <p className="empty-dashboard">
      Loading category leaderboard...
    </p>
  )}


  {categoryLeaderboardError && (
    <p className="error-message">
      {categoryLeaderboardError}
    </p>
  )}


  {!loadingCategoryLeaderboard &&
    !categoryLeaderboardError &&
    categoryLeaderboards.length === 0 && (
      <p className="empty-dashboard">
        No category leaderboard data available yet.
      </p>
    )}


  {!loadingCategoryLeaderboard &&
    !categoryLeaderboardError &&
    selectedCategoryLeaderboard && (

      <div className="leaderboard-table-wrapper">

        <table className="leaderboard-table">

          <thead>
            <tr>
              <th>Rank</th>
              <th>Student</th>
              <th>Correct</th>
              <th>Questions</th>
              <th>Score</th>
            </tr>
          </thead>

          <tbody>

            {selectedCategoryLeaderboard.leaderboard.map(
              (student) => (

                <tr key={student.student_id}>

                  <td>
                    <span
                      className={`leaderboard-rank rank-${student.rank}`}
                    >
                      {student.rank === 1
                        ? "🥇"
                        : student.rank === 2
                        ? "🥈"
                        : student.rank === 3
                        ? "🥉"
                        : `#${student.rank}`}
                    </span>
                  </td>

                  <td>
                    {student.student_name}
                  </td>

                  <td>
                    {student.correct_answers}
                  </td>

                  <td>
                    {student.total_answers}
                  </td>

                  <td>
                    <strong>
                      {student.percentage}%
                    </strong>
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>
    )}

</section>
            

            <section className="admin-dashboard-grid">

              <div className="dashboard-panel">

                <div className="panel-heading">

                  <div>

                    <span className="panel-label">
                      QUICK ACTIONS
                    </span>

                    <h3>
                      Manage Platform
                    </h3>

                  </div>

                </div>

                <div className="quick-actions">

                  <button
                    onClick={() =>
                      handleNavigation(
                        "Quizzes"
                      )
                    }
                  >
                    <span>📚</span>

                    <div>
                      <strong>
                        Manage Quizzes
                      </strong>

                      <small>
                        Create, edit and
                        publish quizzes
                      </small>
                    </div>

                  </button>

                  <button
                    onClick={() =>
                      handleNavigation(
                        "Categories"
                      )
                    }
                  >
                    <span>🏷️</span>

                    <div>
                      <strong>
                        Categories
                      </strong>

                      <small>
                        Organize questions
                      </small>
                    </div>

                  </button>

                  <button
                    onClick={() =>
                      handleNavigation(
                        "Questions"
                      )
                    }
                  >
                    <span>❓</span>

                    <div>
                      <strong>
                        Questions
                      </strong>

                      <small>
                        Add and manage
                        questions
                      </small>
                    </div>

                  </button>

                  <button
                    onClick={() =>
                      handleNavigation(
                        "Users"
                      )
                    }
                  >
                    <span>👥</span>

                    <div>
                      <strong>
                        Students
                      </strong>

                      <small>
                        View registered
                        users
                      </small>
                    </div>

                  </button>

                  <button
                    onClick={() =>
                      handleNavigation(
                        "Results"
                      )
                    }
                  >
                    <span>📊</span>

                    <div>
                      <strong>
                        Results
                      </strong>

                      <small>
                        View quiz
                        submissions
                      </small>
                    </div>

                  </button>

                </div>

              </div>

              <div className="dashboard-panel">

                <div className="panel-heading">

                  <div>

                    <span className="panel-label">
                      QUIZ OVERVIEW
                    </span>

                    <h3>
                      Recent Quizzes
                    </h3>

                  </div>

                  <button
                    className="panel-link"
                    onClick={() =>
                      handleNavigation(
                        "Quizzes"
                      )
                    }
                  >
                    View all
                  </button>

                </div>

                <div className="recent-quiz-list">

                  {quizzes.length ===
                  0 ? (
                    <p className="empty-dashboard">
                      No quizzes available
                      yet.
                    </p>
                  ) : (
                    quizzes
                      .slice(0, 4)
                      .map((quiz) => (
                        <div
                          className="recent-quiz-item"
                          key={quiz.id}
                        >

                          <div className="recent-quiz-icon">
                            📘
                          </div>

                          <div className="recent-quiz-info">

                            <strong>
                              {quiz.title}
                            </strong>

                            <span>
                              {quiz.description ||
                                "No description available."}
                            </span>

                          </div>

                          <span
                            className={
                              quiz.is_published
                                ? "quiz-status published"
                                : "quiz-status unpublished"
                            }
                          >
                            {quiz.is_published
                              ? "Published"
                              : "Draft"}
                          </span>

                        </div>
                      ))
                  )}

                </div>

              </div>

            </section>



          </>
        )}

        {/* ===================================================
            USERS
        =================================================== */}

        {activePage ===
          "Users" && (
          <section className="user-management">

            <h2>
              User Management
            </h2>

            {loadingUsers && (
              <p>
                Loading users...
              </p>
            )}

            {userError && (
              <p className="error-message">
                {userError}
              </p>
            )}

            {!loadingUsers &&
              !userError && (
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

                      {users.length ===
                      0 ? (
                        <tr>
                          <td
                            colSpan="6"
                          >
                            No users found.
                          </td>
                        </tr>
                      ) : (
                        users.map(
                          (user) => (
                            <tr
                              key={
                                user.id
                              }
                            >

                              <td>
                                {
                                  user.id
                                }
                              </td>

                              <td>
                                {
                                  user.name
                                }
                              </td>

                              <td>
                                {
                                  user.email
                                }
                              </td>

                              <td>
                                {
                                  user.role
                                }
                              </td>

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
                          )
                        )
                      )}

                    </tbody>

                  </table>

                </div>
              )}

          </section>
        )}

        {/* ===================================================
            QUIZZES
        =================================================== */}

        {activePage ===
          "Quizzes" && (
          <section className="quiz-management">

            <div className="quiz-management-header">

              <h2>
                Quiz Management
              </h2>

              <button
                className="create-quiz-button"
                onClick={() => {
                  resetQuizForm();
                  setShowQuizForm(true);
                }}
              >
                + Create Quiz
              </button>

            </div>

            {showQuizForm && (
              <div className="quiz-form">

                <h3>
  {editingQuiz
    ? "Edit Quiz"
    : "Create Quiz"}
</h3>

<input
  type="text"
  placeholder="Quiz title"
  value={quizTitle}
  onChange={(event) =>
    setQuizTitle(event.target.value)
  }
/>

<textarea
  placeholder="Quiz description"
  value={quizDescription}
  onChange={(event) =>
    setQuizDescription(event.target.value)
  }
/>

<label>
  Quiz Duration
</label>

<div className="duration-input-wrapper">

  <input
    type="number"
    min="1"
    value={durationMinutes}
    onChange={(event) =>
      setDurationMinutes(event.target.value)
    }
    placeholder="Duration in minutes"
  />

  <span>minutes</span>

</div>

<small className="duration-help-text">
  Set the time students will get to complete this quiz.
</small>

<div className="quiz-form-actions">

  <button
    type="button"
    onClick={resetQuizForm}
  >
    Cancel
  </button>

  <button
    type="button"
    disabled={
      creatingQuiz ||
      updatingQuiz
    }
    onClick={
      editingQuiz
        ? handleUpdateQuiz
        : handleCreateQuiz
    }
  >
    {creatingQuiz
      ? "Creating..."
      : updatingQuiz
      ? "Saving..."
      : editingQuiz
      ? "Save Changes"
      : "Create Quiz"}
  </button>

</div>

              </div>
            )}

            {loadingQuizzes && (
              <p>
                Loading quizzes...
              </p>
            )}

            {quizError && (
              <p className="error-message">
                {quizError}
              </p>
            )}

            {!loadingQuizzes &&
              !quizError && (
                <div className="quiz-list">

                  {quizzes.length ===
                  0 ? (
                    <p>
                      No quizzes found.
                    </p>
                  ) : (
                    quizzes.map(
                      (quiz) => (
                        <div
                          className="quiz-card"
                          key={quiz.id}
                        >

                          <div className="quiz-card-content">

                            <h3>
                              {quiz.title}
                            </h3>

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
                              onClick={() =>
                                handleStartEditQuiz(
                                  quiz
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteQuiz(
                                  quiz
                                )
                              }
                            >
                              Delete
                            </button>

                            <button
                              onClick={() =>
                                handlePublishQuiz(
                                  quiz
                                )
                              }
                            >
                              {quiz.is_published
                                ? "Unpublish"
                                : "Publish"}
                            </button>

                          </div>

                        </div>
                      )
                    )
                  )}

                </div>
              )}

          </section>
        )}

        {/* ===================================================
            CATEGORIES
        =================================================== */}

        {activePage ===
          "Categories" && (
          <section className="category-management">

            <div className="section-header">

              <h2>
                Category Management
              </h2>

              <button
                className="create-quiz-button"
                onClick={() => {
                  resetCategoryForm();
                  setShowCategoryForm(
                    true
                  );
                }}
              >
                + Add Category
              </button>

            </div>

            {showCategoryForm && (
              <div className="quiz-form">

                <h3>
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h3>

                <input
                  type="text"
                  placeholder="Category name"
                  value={categoryName}
                  onChange={(event) =>
                    setCategoryName(
                      event.target.value
                    )
                  }
                />

                <textarea
                  placeholder="Category description"
                  value={
                    categoryDescription
                  }
                  onChange={(event) =>
                    setCategoryDescription(
                      event.target.value
                    )
                  }
                />

                <div className="quiz-form-actions">

                  <button
                    type="button"
                    onClick={
                      resetCategoryForm
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={
                      creatingCategory ||
                      updatingCategory
                    }
                    onClick={
                      editingCategory
                        ? handleUpdateCategory
                        : handleCreateCategory
                    }
                  >
                    {creatingCategory
                      ? "Creating..."
                      : updatingCategory
                      ? "Saving..."
                      : editingCategory
                      ? "Save Changes"
                      : "Create Category"}
                  </button>

                </div>

              </div>
            )}

            {loadingCategories && (
              <p>
                Loading categories...
              </p>
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

                      {categories.length ===
                      0 ? (
                        <tr>
                          <td
                            colSpan="6"
                          >
                            No categories
                            found.
                          </td>
                        </tr>
                      ) : (
                        categories.map(
                          (category) => (
                            <tr
                              key={
                                category.id
                              }
                            >

                              <td>
                                {
                                  category.id
                                }
                              </td>

                              <td>
                                {
                                  category.name
                                }
                              </td>

                              <td>
                                {
                                  category.description ||
                                  "—"
                                }
                              </td>

                              <td>
                                {category.created_at
                                  ? new Date(
                                      category.created_at
                                    ).toLocaleDateString()
                                  : "—"}
                              </td>

                              <td>
                                {category.updated_at
                                  ? new Date(
                                      category.updated_at
                                    ).toLocaleDateString()
                                  : "—"}
                              </td>

                              <td>

                                <button
                                  onClick={() =>
                                    handleStartEditCategory(
                                      category
                                    )
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() =>
                                    handleDeleteCategory(
                                      category
                                    )
                                  }
                                >
                                  Delete
                                </button>

                              </td>

                            </tr>
                          )
                        )
                      )}

                    </tbody>

                  </table>

                </div>
              )}

          </section>
        )}

        {/* ===================================================
            QUESTIONS
        =================================================== */}

        {activePage ===
          "Questions" && (
          <section className="question-management">

            <div className="section-header">

              <h2>
                Question Management
              </h2>

              {selectedQuizId && (
                <button
                  className="create-quiz-button"
                  onClick={() => {
                    resetQuestionForm();
                    setShowQuestionForm(
                      true
                    );
                  }}
                >
                  + Add Question
                </button>
              )}

            </div>

            {/* QUIZ SELECT */}

            <div className="question-quiz-selector">

              <label htmlFor="quiz-select">
                Select Quiz
              </label>

              <select
                id="quiz-select"
                value={selectedQuizId}
                onChange={(event) => {
                  setSelectedQuizId(
                    event.target.value
                  );

                  resetQuestionForm();

                  setQuestionError("");
                }}
              >

                <option value="">
                  -- Select a Quiz --
                </option>

                {quizzes.map(
                  (quiz) => (
                    <option
                      key={quiz.id}
                      value={quiz.id}
                    >
                      {quiz.title}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* QUESTION FORM */}

            {showQuestionForm && !editingQuestion && (
              <div className="quiz-form">

                <h3>
                  {editingQuestion
                    ? "Edit Question"
                    : "Add Question"}
                </h3>

                <label>
                  Category
                </label>

                <select
                  value={
                    selectedCategoryId
                  }
                  onChange={(event) =>
                    setSelectedCategoryId(
                      event.target.value
                    )
                  }
                >

                  <option value="">
                    -- Select Category --
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category.id
                        }
                        value={
                          category.id
                        }
                      >
                        {
                          category.name
                        }
                      </option>
                    )
                  )}

                </select>

                <label>
                  Question
                </label>

                <textarea
                  placeholder="Enter question"
                  value={
                    questionText
                  }
                  onChange={(event) =>
                    setQuestionText(
                      event.target.value
                    )
                  }
                />

                <label>
  Explanation
</label>

<textarea
  placeholder="Explain why the correct answer is correct"
  value={questionExplanation}
  onChange={(event) =>
    setQuestionExplanation(
      event.target.value
    )
  }
/>

                <label>
                  Options
                </label>

                {questionOptions.map(
                  (
                    option,
                    index
                  ) => (
                    <div
                      key={index}
                      className="question-option-row"
                    >

                      <input
                        type="text"
                        placeholder={`Option ${
                          index + 1
                        }`}
                        value={
                          option.option_text
                        }
                        onChange={(
                          event
                        ) => {
                          const updated =
                            [
                              ...questionOptions,
                            ];

                          updated[
                            index
                          ] = {
                            ...updated[
                              index
                            ],

                            option_text:
                              event.target
                                .value,
                          };

                          setQuestionOptions(
                            updated
                          );
                        }}
                      />

                      <label>

                        <input
                          type="radio"
                          name="correct-answer"
                          checked={
                            option.is_correct
                          }
                          onChange={() => {

                            setQuestionOptions(
                              questionOptions.map(
                                (
                                  item,
                                  optionIndex
                                ) => ({
                                  ...item,

                                  is_correct:
                                    optionIndex ===
                                    index,
                                })
                              )
                            );

                          }}
                        />

                        Correct

                      </label>

                    </div>
                  )
                )}

                <div className="quiz-form-actions">

                  <button
                    type="button"
                    onClick={
                      resetQuestionForm
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={
                      creatingQuestion
                    }
                    onClick={
                      handleSaveQuestion
                    }
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

            {/* QUESTION ERROR */}

            {questionError && (
              <p className="error-message">
                {questionError}
              </p>
            )}

            {/* QUESTIONS */}

            {selectedQuizId && (
              <div className="questions-list">

                {loadingQuestions && (
                  <p>
                    Loading questions...
                  </p>
                )}

                {!loadingQuestions &&
                  questionList.length ===
                    0 && (
                    <p>
                      No questions found
                      for this quiz.
                    </p>
                  )}

                {!loadingQuestions &&
                  questionList.map((question) => (
  <div
    className="question-card"
    key={question.id}
  >

    <h3>
      {question.question_text}
    </h3>

    {question.explanation && (
      <p>
        <strong>Explanation:</strong>{" "}
        {question.explanation}
      </p>
    )}

    {question.options?.map((option) => (
      <p key={option.id}>
        {option.is_correct ? "✅" : "○"}{" "}
        {option.option_text}
      </p>
    ))}

    <div className="question-actions">

      <button
        type="button"
        onClick={() =>
          handleEditQuestion(question)
        }
      >
        Edit
      </button>

      <button
        type="button"
        onClick={() =>
          handleDeleteQuestion(question.id)
        }
      >
        Delete
      </button>

    </div>

    {/* EDIT FORM FOR THIS QUESTION ONLY */}

    {editingQuestion?.id === question.id && (
      <div className="quiz-form inline-question-edit">

        <h3>
          Edit Question
        </h3>

        <label>
          Category
        </label>

        <select
          value={selectedCategoryId}
          onChange={(event) =>
            setSelectedCategoryId(
              event.target.value
            )
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

        <label>
          Question
        </label>

        <textarea
          placeholder="Enter question"
          value={questionText}
          onChange={(event) =>
            setQuestionText(
              event.target.value
            )
          }
        />

        <label>
          Explanation
        </label>

        <textarea
          placeholder="Explain why the correct answer is correct"
          value={questionExplanation}
          onChange={(event) =>
            setQuestionExplanation(
              event.target.value
            )
          }
        />

        <label>
          Options
        </label>

        {questionOptions.map(
          (option, index) => (
            <div
              key={index}
              className="question-option-row"
            >

              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option.option_text}
                onChange={(event) => {
                  const updated = [
                    ...questionOptions,
                  ];

                  updated[index] = {
                    ...updated[index],
                    option_text:
                      event.target.value,
                  };

                  setQuestionOptions(updated);
                }}
              />

              <label>

                <input
                  type="radio"
                  name={`correct-answer-${question.id}`}
                  checked={
                    option.is_correct
                  }
                  onChange={() => {
                    setQuestionOptions(
                      questionOptions.map(
                        (
                          item,
                          optionIndex
                        ) => ({
                          ...item,
                          is_correct:
                            optionIndex === index,
                        })
                      )
                    );
                  }}
                />

                Correct

              </label>

            </div>
          )
        )}

        <div className="quiz-form-actions">

          <button
            type="button"
            onClick={resetQuestionForm}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={creatingQuestion}
            onClick={handleSaveQuestion}
          >
            {creatingQuestion
              ? "Updating..."
              : "Update Question"}
          </button>

        </div>

      </div>
    )}

  </div>
))}

              </div>
            )}

            {!selectedQuizId && (
              <p>
                Please select a quiz to
                manage its questions.
              </p>
            )}

          </section>
        )}

        {/* ===================================================
            RESULTS
        =================================================== */}

        {activePage ===
          "Results" && (
          <section className="results-management">

            <div className="section-header">

              <div>

                <h2>
                  Quiz Results
                </h2>

                <p>
                  View submitted quiz
                  attempts and scores.
                </p>

              </div>

              <button
                className="create-quiz-button"
                onClick={
                  fetchResults
                }
              >
                Refresh Results
              </button>

            </div>

            {loadingResults && (
              <p>
                Loading results...
              </p>
            )}

            {resultError && (
              <p className="error-message">
                {resultError}
              </p>
            )}

            {!loadingResults &&
              !resultError && (
                <div className="users-table-container">

                  {results.length ===
                  0 ? (
                    <p>
                      No quiz results
                      available yet.
                    </p>
                  ) : (
                    <table className="users-table">

                      <thead>

                        <tr>
                          <th>
                            Student
                          </th>

                          <th>
                            Email
                          </th>

                          <th>
                            Quiz
                          </th>

                          <th>
                            Score
                          </th>

                          <th>
                            Total
                          </th>

                          <th>
                            Percentage
                          </th>

                          <th>
                            Status
                          </th>

                          <th>
                            Submitted At
                          </th>
                        </tr>

                      </thead>

                      <tbody>

                        {results.map(
                          (
                            result,
                            index
                          ) => {

                            const score =
                              Number(
                                result.score ||
                                  0
                              );

                            const total =
                              Number(
                                result.total_questions ||
                                  result.total ||
                                  0
                              );

                            const percentage =
                              total >
                              0
                                ? Math.round(
                                    (score /
                                      total) *
                                      100
                                  )
                                : 0;

                            return (
                              <tr
                                key={
                                  result.id ||
                                  index
                                }
                              >

                                <td>
                                  {
                                    result.student_name ||
                                    result.name ||
                                    "—"
                                  }
                                </td>

                                <td>
                                  {
                                    result.student_email ||
                                    result.email ||
                                    "—"
                                  }
                                </td>

                                <td>
                                  {
                                    result.quiz_title ||
                                    result.title ||
                                    "—"
                                  }
                                </td>

                                <td>
                                  {score}
                                </td>

                                <td>
                                  {total}
                                </td>

                                <td>
  {percentage}%
</td>

<td>
  <span
    className={
      percentage >= 40
        ? "result-status pass"
        : "result-status fail"
    }
  >
    {percentage >= 40
      ? "Pass"
      : "Fail"}
  </span>
</td>

<td>
  {result.submitted_at
    ? new Date(
        result.submitted_at
      ).toLocaleString()
    : "—"}
</td>

                              </tr>
                            );
                          }
                        )}

                      </tbody>

                    </table>
                  )}

                </div>
              )}

          </section>
        )}

      </main>

    </div>
  );
}

export default AdminDashboard;