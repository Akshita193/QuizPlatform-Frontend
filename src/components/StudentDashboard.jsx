import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./StudentDashboard.css";

function StudentDashboard({ user, onLogout }) {
  // ==============================
  // PAGE STATE
  // ==============================

  const [activePage, setActivePage] = useState("Overview");

  // ==============================
  // QUIZ LIST STATE
  // ==============================

  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [quizError, setQuizError] = useState("");

  // ==============================
  // CURRENT QUIZ STATE
  // ==============================

  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionError, setQuestionError] = useState("");

  // ==============================
  // ANSWERS
  // ==============================

  const [selectedAnswers, setSelectedAnswers] = useState({});

  // ==============================
  // TIMER
  // 5 MINUTES
  // ==============================

  const [timeLeft, setTimeLeft] = useState(0);

  // ==============================
  // SUBMISSION
  // ==============================

  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);


  // ==============================
// MY RESULTS STATE
// ==============================

const [myResults, setMyResults] = useState([]);
const [loadingResults, setLoadingResults] = useState(false);
const [resultsError, setResultsError] = useState("");   
const [selectedAttemptReview, setSelectedAttemptReview] = useState(null);
const [loadingReview, setLoadingReview] = useState(false);
const [reviewError, setReviewError] = useState("");

  // ==============================
  // FETCH PUBLISHED QUIZZES
  // ==============================

  useEffect(() => {
    if (
      activePage === "Overview" ||
      activePage === "My Quizzes"
    ) {
      fetchPublishedQuizzes();
    }
  }, [activePage]);

  useEffect(() => {
  if (
    activePage === "Overview" ||
    activePage === "My Quizzes" ||
    activePage === "My Results"
  ) {
    fetchMyResults();
  }
}, [activePage]);

  const fetchPublishedQuizzes = async () => {
    setLoadingQuizzes(true);
    setQuizError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5001/api/quizzes/published",
        {
          method: "GET",
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
      console.error(
        "Fetch published quizzes error:",
        error
      );

      setQuizError(error.message);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  // ==============================
// FETCH MY RESULTS
// ==============================

const fetchMyResults = async () => {
  setLoadingResults(true);
  setResultsError("");

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:5001/api/quizzes/my-results",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    console.log("MY RESULTS RESPONSE:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch results"
      );
    }

    setMyResults(data.results || []);
  } catch (error) {
    console.error("Fetch my results error:", error);
    setResultsError(error.message);
  } finally {
    setLoadingResults(false);
  }
};


const fetchAttemptReview = async (attemptId) => {
  try {
    setLoadingReview(true);
    setReviewError("");

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5001/api/quizzes/attempts/${attemptId}/review`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch answer review"
      );
    }

    setSelectedAttemptReview(data);
  } catch (error) {
    console.error("Fetch review error:", error);
    setReviewError(error.message);
  } finally {
    setLoadingReview(false);
  }
};
  // ==============================
  // START QUIZ
  // ==============================

  const handleStartQuiz = async (quiz) => {
    try {
      setQuestionError("");
      setLoadingQuestions(true);

      const token = localStorage.getItem("token");

      // Reset quiz state
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
      setTimeLeft(5 * 60);
      setIsQuizSubmitted(false);
      setIsSubmitting(false);

      // --------------------------------
      // CHECK WHETHER ALREADY ATTEMPTED
      // --------------------------------

      const attemptResponse = await fetch(
        `http://localhost:5001/api/quizzes/${quiz.id}/attempt`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const attemptData = await attemptResponse.json();

      if (!attemptResponse.ok) {
        throw new Error(
          attemptData.message ||
            "Failed to check quiz attempt"
        );
      }

      // Already submitted
      if (attemptData.attempted) {
        alert(
          "You have already submitted this quiz."
        );
        return;
      }

      // --------------------------------
      // LOAD QUIZ QUESTIONS
      // --------------------------------

      const response = await fetch(
        `http://localhost:5001/api/quizzes/${quiz.id}/questions`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load quiz"
        );
      }

      setSelectedQuiz(data.quiz);
      setQuizQuestions(data.questions || []);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setTimeLeft(
  Number(data.quiz.duration_minutes) * 60
);
      setIsQuizSubmitted(false);

      setActivePage("QuizScreen");
    } catch (error) {
      console.error(
        "Start quiz error:",
        error
      );

      setQuestionError(error.message);
      alert(error.message);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // ==============================
  // TIMER
  // ==============================

  useEffect(() => {
    if (
      activePage !== "QuizScreen" ||
      isQuizSubmitted
    ) {
      return;
    }

    if (timeLeft <= 0) {
      handleSubmitQuiz(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    activePage,
    timeLeft,
    isQuizSubmitted,
  ]);

  // ==============================
  // FORMAT TIMER
  // ==============================

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  // ==============================
  // SELECT ANSWER
  // ==============================

  const handleAnswerSelect = (
    questionId,
    optionId
  ) => {
    if (isQuizSubmitted || isSubmitting) {
      return;
    }

    // Make sure IDs are numbers
    const numericQuestionId = Number(
      questionId
    );

    const numericOptionId = Number(
      optionId
    );

    // Prevent NaN from entering state
    if (
      !Number.isInteger(
        numericQuestionId
      ) ||
      !Number.isInteger(
        numericOptionId
      )
    ) {
      console.error(
        "Invalid question or option ID:",
        {
          questionId,
          optionId,
        }
      );

      return;
    }

    setSelectedAnswers(
      (previousAnswers) => ({
        ...previousAnswers,
        [numericQuestionId]:
          numericOptionId,
      })
    );
  };

  // ==============================
  // NEXT QUESTION
  // ==============================

  const handleNextQuestion = () => {
    if (
      currentQuestionIndex <
      quizQuestions.length - 1
    ) {
      setCurrentQuestionIndex(
        (previousIndex) =>
          previousIndex + 1
      );
    }
  };

  // ==============================
  // PREVIOUS QUESTION
  // ==============================

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(
        (previousIndex) =>
          previousIndex - 1
      );
    }
  };

  // ==============================
  // SUBMIT QUIZ
  // ==============================

  const handleSubmitQuiz = async (
    automaticSubmit = false
  ) => {
    // Prevent double submission
    if (
      isQuizSubmitted ||
      isSubmitting
    ) {
      return;
    }

    if (!selectedQuiz) {
      alert("No quiz selected.");
      return;
    }

    // ==================================
    // CHECK UNANSWERED QUESTIONS
    // Only for normal submission
    // ==================================

    if (!automaticSubmit) {
      const unansweredQuestions =
        quizQuestions.filter(
          (question) =>
            !selectedAnswers[
              question.id
            ]
        );

      if (
        unansweredQuestions.length > 0
      ) {
        alert(
          `Please answer all questions before submitting. ${unansweredQuestions.length} question(s) are unanswered.`
        );

        return;
      }
    }

    setIsSubmitting(true);

    try {
      const token =
        localStorage.getItem("token");

      // ==================================
      // CREATE ANSWERS ARRAY
      // ==================================

      const answers = quizQuestions.map(
        (question) => ({
          question_id: Number(
            question.id
          ),

          selected_option_id:
            selectedAnswers[
              question.id
            ]
              ? Number(
                  selectedAnswers[
                    question.id
                  ]
                )
              : null,
        })
      );

      // ==================================
      // IMPORTANT DEBUG LOG
      // ==================================

      console.log(
        "FINAL ANSWERS SENT TO BACKEND:",
        answers
      );

      // ==================================
      // CHECK FOR INVALID NaN VALUES
      // ==================================

      const hasInvalidAnswer =
        answers.some(
          (answer) =>
            !Number.isInteger(
              answer.question_id
            ) ||
            (answer.selected_option_id !==
              null &&
              !Number.isInteger(
                answer.selected_option_id
              ))
        );

      if (hasInvalidAnswer) {
        console.error(
          "Invalid answer data:",
          answers
        );

        throw new Error(
          "Invalid question or option ID detected."
        );
      }

      // ==================================
      // SEND TO BACKEND
      // ==================================

      const response = await fetch(
        `http://localhost:5001/api/quizzes/${selectedQuiz.id}/submit`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            answers,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "SUBMIT QUIZ RESPONSE:",
        data
      );

      // ==================================
      // HANDLE BACKEND ERROR
      // ==================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit quiz"
        );
      }

      // ==================================
// SUCCESS
// ==================================

setSubmittedResult(data.result);
setIsQuizSubmitted(true);

      if (automaticSubmit) {
        alert(
          "Time is up! Your quiz has been submitted."
        );
      } else {
        alert(
          "Quiz submitted successfully!"
        );
      }
    } catch (error) {
      console.error(
        "Submit quiz error:",
        error
      );

      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==============================
  // EXIT QUIZ
  // ==============================

  const handleExitQuiz = () => {
    const confirmExit =
      window.confirm(
        "Are you sure you want to leave this quiz? Your current answers will be lost."
      );

    if (!confirmExit) {
      return;
    }

    setSelectedQuiz(null);
setQuizQuestions([]);
setSelectedAnswers({});
setCurrentQuestionIndex(0);
setTimeLeft(0);
setIsQuizSubmitted(false);
setIsSubmitting(false);
setSubmittedResult(null);
setQuestionError("");

setActivePage("My Quizzes");
  };

  // ==============================
  // RESET QUIZ AFTER SUBMISSION
  // ==============================

  const handleBackToMyQuizzes = () => {
    setSelectedQuiz(null);
    setQuizQuestions([]);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeft(0);
    setIsQuizSubmitted(false);
    setIsSubmitting(false);
    setQuestionError("");

    setActivePage("My Quizzes");
  };

  // ==============================
  // CURRENT QUESTION
  // ==============================

  const currentQuestion =
    quizQuestions[
      currentQuestionIndex
    ];

    const getQuizResult = (quizId) => {
  return myResults.find(
    (result) =>
      Number(result.quiz_id) === Number(quizId)
  );
};

// ==============================
// RESULT STATUS
// ==============================

const getResultStatus = (result) => {
  if (result.result_status) {
    return result.result_status;
  }

  const score = Number(result.score) || 0;
  const total =
    Number(result.total_questions) || 0;

  const percentage =
    total > 0
      ? Math.round((score / total) * 100)
      : 0;

  return percentage >= 40
    ? "PASS"
    : "FAIL";
};


// ==============================
// DASHBOARD STATISTICS
// ==============================

const completedQuizzes = myResults.length;

const passedQuizzes = myResults.filter((result) => {
  return getResultStatus(result).toUpperCase() === "PASS";
}).length;

const failedQuizzes =
  completedQuizzes - passedQuizzes;

const averageScore =
  completedQuizzes > 0
    ? Math.round(
        myResults.reduce((total, result) => {
          const score = Number(result.score) || 0;
          const totalQuestions =
            Number(result.total_questions) || 0;

          const percentage =
            totalQuestions > 0
              ? (score / totalQuestions) * 100
              : 0;

          return total + percentage;
        }, 0) / completedQuizzes
      )
    : 0;

    const totalQuizzes = quizzes.length;

const notAttemptedQuizzes =
  Math.max(totalQuizzes - completedQuizzes, 0);

const progressPercentage =
  totalQuizzes > 0
    ? Math.round(
        (completedQuizzes / totalQuizzes) * 100
      )
    : 0;

    // ==============================
// PERFORMANCE CHART DATA
// ==============================

const performanceData = myResults.map((result) => {
  const score = Number(result.score) || 0;
  const total =
    Number(result.total_questions) || 0;

  const percentage =
    total > 0
      ? Math.round(
          (score / total) * 100
        )
      : 0;

  return {
    quiz: result.title,
    percentage,
  };
});


const CustomXAxisTick = ({ x, y, payload }) => {
  const text = payload.value || "";

  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine
      ? `${currentLine} ${word}`
      : word;

    if (testLine.length > 14) {
      if (currentLine) {
        lines.push(currentLine);
      }

      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return (
    <g
      transform={`translate(${x}, ${
        y + 15
      })`}
    >
      <text
        x={0}
        y={0}
        textAnchor="middle"
        fontSize="11"
        fill="#666"
      >
        {lines
          .slice(0, 2)
          .map((line, index) => (
            <tspan
              key={index}
              x={0}
              dy={
                index === 0
                  ? 12
                  : 15
              }
            >
              {line}
            </tspan>
          ))}
      </text>
    </g>
  );
};
  // ==============================
  // RENDER
  // ==============================

  return (
    <div className="student-dashboard">

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className="student-sidebar">

        {/* BRAND */}

        <div className="student-brand">
          <div className="brand-icon">
            🎓
          </div>

          <span>
            QuizPlatform
          </span>
        </div>

        {/* PROFILE */}

        <div className="student-profile">

          <div className="student-avatar">
            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "S"}
          </div>

          <div>
            <h4>
              {user?.name ||
                "Student"}
            </h4>

            <span>
              Student
            </span>
          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="student-nav">

          <button
            className={
              activePage ===
              "Overview"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage(
                "Overview"
              )
            }
          >
            <span>⌂</span>
            Overview
          </button>

          <button
            className={
              activePage ===
              "My Quizzes"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage(
                "My Quizzes"
              )
            }
          >
            <span>▣</span>
            My Quizzes
          </button>

          <button
            className={
              activePage ===
              "My Results"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage(
                "My Results"
              )
            }
          >
            <span>◒</span>
            My Results
          </button>

          <button
            className={
              activePage ===
              "Profile"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage(
                "Profile"
              )
            }
          >
            <span>♙</span>
            Profile
          </button>

          <button
            className={
              activePage ===
              "Settings"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage(
                "Settings"
              )
            }
          >
            <span>⚙</span>
            Settings
          </button>

          <button
            onClick={onLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </nav>

        {/* LEARNING CARD */}

        <div className="learning-card">

          <h4>
            Keep Learning!
          </h4>

          <p>
            Every quiz makes you
            better 🚀
          </p>

        </div>

      </aside>

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="student-main">

        {/* =================================
            HEADER
        ================================= */}

        <header className="student-header">

          <div>

            <h1>
              Welcome back,{" "}
              {user?.name ||
                "Student"}! 👋
            </h1>

            <p>
              Keep learning, keep
              growing.
            </p>

          </div>

          <button
            className="notification-button"
            type="button"
          >
            ♧
            <span></span>
          </button>

        </header>

        {/* =====================================
            OVERVIEW
        ===================================== */}

        {activePage ===
          "Overview" && (
          <>

            {/* STATS */}

            <section className="student-stats">

              <div className="student-stat-card blue">

                <div className="stat-icon">
                  ▣
                </div>

                <div>
                  <p>
                    Available Quizzes
                  </p>

                  <h2>
                    {quizzes.length}
                  </h2>

                  <span>
                    Take a quiz
                  </span>
                </div>

              </div>

              <div className="student-stat-card green">

                <div className="stat-icon">
                  ✓
                </div>

                <div>
                  <p>
                    Completed Quizzes
                  </p>

                  <h2>
                    {completedQuizzes}
                  </h2>

                  <span>
                    Keep it up!
                  </span>
                </div>

              </div>

              <div className="student-stat-card purple">

                <div className="stat-icon">
                  ◔
                </div>

                <div>
                  <p>
                    Average Score
                  </p>

                  <h2>
                    {averageScore}%
                  </h2>

                  <span>
                    Your performance
                  </span>
                </div>

              </div>


            </section>

            {/* CONTENT GRID */}

            <section className="student-content-grid">

                 {/* LEFT COLUMN */}

                <div className="student-left-column">

              {/* QUIZZES */}

              <div className="student-quizzes-section">

                <div className="section-heading">

                  <h2>
                    Your Quizzes
                  </h2>

                  <button
                    type="button"
                    onClick={() =>
                      setActivePage(
                        "My Quizzes"
                      )
                    }
                  >
                    View All
                  </button>

                </div>

                {loadingQuizzes && (
                  <div className="glass-message">
                    Loading quizzes...
                  </div>
                )}

                {quizError && (
                  <div className="glass-message error">
                    {quizError}
                  </div>
                )}

                {!loadingQuizzes &&
                  !quizError &&
                  quizzes.length ===
                    0 && (
                    <div className="glass-message">
                      No quizzes are
                      currently
                      available.
                    </div>
                  )}

                 <div className="dashboard-quiz-scroll">

                {!loadingQuizzes &&
                  !quizError &&
                  quizzes
                    .map(
                      (
                        quiz,
                        index
                      ) => (

                        <div
                          className="student-quiz-card"
                          key={
                            quiz.id
                          }
                        >

                          <div
                            className={`quiz-icon quiz-color-${index % 3}`}
                          >
                            ▣
                          </div>

                          <div className="quiz-info">

                            <h3>
                              {quiz.title}
                            </h3>

                            <p>
                              {quiz.description ||
                                "Test your knowledge and improve your skills."}
                            </p>

                          </div>

                          <div className="quiz-question-count">
                            Quiz
                          </div>

                          <button
                            type="button"
                            className="start-quiz-button"
                            onClick={() =>
                              handleStartQuiz(
                                quiz
                              )
                            }
                            disabled={
                              loadingQuestions
                            }
                          >
                            {loadingQuestions
                              ? "Loading..."
                              : "Start Quiz"}
                          </button>

                        </div>
                      )
                    )}

                 </div>

                  </div>


    {/* =========================
        PERFORMANCE CHART
    ========================= */}

    <div className="performance-chart-card">

      <div className="section-heading">

        <div>
          <span className="panel-label">
            PERFORMANCE
          </span>

          <h2>
            Quiz Performance
          </h2>
        </div>

      </div>

      {performanceData.length === 0 ? (

        <div className="glass-message">
          No performance data available yet.
        </div>

      ) : (

        <div className="performance-chart-wrapper">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={performanceData}
            >

              
            <XAxis
  dataKey="quiz"
  interval={0}
  height={80}
  tick={<CustomXAxisTick />}
/>

<YAxis
  domain={[0, 100]}
  tick={{
    fontSize: 11,
  }}
/>

              <Tooltip />

              <Bar
  dataKey="percentage"
  fill="#8b5cf6"
  radius={[8, 8, 0, 0]}
/>

            </BarChart>

          </ResponsiveContainer>

        </div>

      )}

    </div>
</div>

  {/* RIGHT COLUMN */}

  <div className="student-right-column">

                {/* PROGRESS */}

                <div className="progress-card">

                  <div className="section-heading">

                    <h2>
                      Progress Overview
                    </h2>

                  </div>

                  <div className="progress-circle">

                    <div className="progress-inner">

                      <strong>
                        {progressPercentage}%
                      </strong>

                      <span>
                        Overall Progress
                      </span>

                    </div>

                  </div>

                  <div className="progress-legend">

                    <div>
                      <span className="dot green-dot"></span>

                      Completed

                      <strong>
                        {completedQuizzes} Quizzes 
                      </strong>
                    </div>

                    <div>
                      <span className="dot blue-dot"></span>

                      In Progress

                      <strong>
                        0 Quizzes
                      </strong>
                    </div>

                    <div>
                      <span className="dot gray-dot"></span>

                      Not Attempted

                      <strong>
                        {notAttemptedQuizzes} Quizzes
                      </strong>
                    </div>

                  </div>

                </div>

                {/* RECENT ACTIVITY */}

                <div className="activity-card">

                  <h2>
                    Recent Activity
                  </h2>

                  <div className="activity-item">

                    <div className="activity-icon green-bg">
                      ✓
                    </div>

                    <div>
                      <p>
                        Quiz Completed
                      </p>

                      <span>
                        No completed
                        quizzes yet
                      </span>
                    </div>

                    <small>
                      —
                    </small>

                  </div>

                  <div className="activity-item">

                    <div className="activity-icon blue-bg">
                      ▣
                    </div>

                    <div>
                      <p>
                        Quiz Attempted
                      </p>

                      <span>
                        Start your
                        first quiz
                      </span>
                    </div>

                    <small>
                      Now
                    </small>

                  </div>

                  <div className="activity-item">

                    <div className="activity-icon purple-bg">
                      ♙
                    </div>

                    <div>
                      <p>
                        Joined Platform
                      </p>

                      <span>
                        Welcome to
                        QuizPlatform
                      </span>
                    </div>

                    <small>
                      —
                    </small>

                  </div>

                </div>
                <div className="dashboard-panel">

  <div className="panel-heading">
    <div>
      <span className="panel-label">
        QUIZ HISTORY
      </span>

      <h3>
        Recent Attempts
      </h3>
    </div>

    <button
      className="panel-link"
      onClick={() =>
        setActivePage("My Results")
      }
    >
      View All
    </button>
  </div>

  {myResults.length === 0 ? (
    <p className="empty-dashboard">
      No quiz attempts yet.
    </p>
  ) : (
    <div className="recent-attempt-list">

      {myResults
        .slice(0, 3)
        .map((result) => {
          const score =
            Number(result.score) || 0;

          const total =
            Number(result.total_questions) || 0;

          const percentage =
            total > 0
              ? Math.round(
                  (score / total) * 100
                )
              : 0;

          const status =
            getResultStatus(result);

          return (
            <div
              className="recent-attempt-item"
              key={result.attempt_id}
            >
              <div>
                <strong>
                  {result.title}
                </strong>

                <span>
                  {score}/{total} · {percentage}%
                </span>
              </div>

              <span
                className={
                  status === "PASS" ||
                  status === "Pass"
                    ? "mini-result-pass"
                    : "mini-result-fail"
                }
              >
                {status}
              </span>
            </div>
          );
        })}

    </div>
  )}

</div>
</div>

            </section>

          </>
        )}

        {/* =====================================
            MY QUIZZES
        ===================================== */}

        {activePage ===
          "My Quizzes" && (
          <section className="page-section">

            <div className="section-heading">

              <div>

                <h2>
                  My Quizzes
                </h2>

                <p>
                  Choose a quiz and
                  test your knowledge.
                </p>

              </div>

            </div>

            {loadingQuizzes && (
              <div className="glass-message">
                Loading quizzes...
              </div>
            )}

            {quizError && (
              <div className="glass-message error">
                {quizError}
              </div>
            )}

            {!loadingQuizzes &&
              !quizError &&
              quizzes.length ===
                0 && (
                <div className="glass-message">
                  No quizzes are
                  currently
                  available.
                </div>
              )}

            <div className="all-quizzes-grid">

              {quizzes.map(
                (
                  quiz,
                  index
                ) => (

                  <div
                    className="large-quiz-card"
                    key={quiz.id}
                  >

                    <div
                      className={`large-quiz-icon quiz-color-${index % 3}`}
                    >
                      ▣
                    </div>

                    <h3>
                      {quiz.title}
                    </h3>

                    <p>
                      {quiz.description ||
                        "Test your knowledge and improve your skills."}
                    </p>

                    <button
                      type="button"
                      className="start-quiz-button"
                      onClick={() =>
                        handleStartQuiz(
                          quiz
                        )
                      }
                      disabled={
                        loadingQuestions
                      }
                    >
                      {loadingQuestions
                        ? "Loading..."
                        : "Start Quiz"}
                    </button>

                  </div>

                )
              )}

            </div>

          </section>
        )}

        {/* =====================================
            QUIZ SCREEN
        ===================================== */}

        {activePage ===
          "QuizScreen" && (
          <section className="quiz-screen">

            {/* QUIZ HEADER */}

            <div className="quiz-screen-header">

              <button
                type="button"
                className="back-quiz-button"
                onClick={
                  handleExitQuiz
                }
                disabled={
                  isSubmitting
                }
              >
                ← Back to Quizzes
              </button>

              <div className="quiz-screen-title">

                <h2>
                  {selectedQuiz?.title}
                </h2>

                <p>
                  Question{" "}
                  {currentQuestionIndex +
                    1}{" "}
                  of{" "}
                  {
                    quizQuestions.length
                  }
                </p>

              </div>

              {/* TIMER */}

              <div
                className={
                  timeLeft <= 60
                    ? "quiz-timer warning"
                    : "quiz-timer"
                }
              >
                ⏱{" "}
                {formatTime(
                  timeLeft
                )}
              </div>

            </div>

            {/* ERROR */}

            {questionError && (
              <div className="glass-message error">
                {questionError}
              </div>
            )}

            {/* LOADING */}

            {loadingQuestions && (
              <div className="glass-message">
                Loading quiz...
              </div>
            )}

            {/* QUESTION */}

            {!loadingQuestions &&
              currentQuestion &&
              !isQuizSubmitted && (
                <div className="quiz-question-card">

                  <div className="question-number">
                    Question{" "}
                    {currentQuestionIndex +
                      1}
                  </div>

                  <h3>
                    {
                      currentQuestion.question_text
                    }
                  </h3>

                  {/* OPTIONS */}

                  <div className="options-list">

                    {currentQuestion.options?.map(
                      (option) => {

                        const isSelected =
                          selectedAnswers[
                            currentQuestion.id
                          ] ===
                          option.id;

                        return (
                          <button
                            key={
                              option.id
                            }
                            type="button"
                            className={
                              isSelected
                                ? "quiz-option selected"
                                : "quiz-option"
                            }
                            onClick={() =>
                              handleAnswerSelect(
                                currentQuestion.id,
                                option.id
                              )
                            }
                            disabled={
                              isSubmitting
                            }
                          >

                            <span className="option-circle">

                              {isSelected
                                ? "✓"
                                : ""}

                            </span>

                            <span>
                              {
                                option.option_text
                              }
                            </span>

                          </button>
                        );
                      }
                    )}

                  </div>

                  {/* NAVIGATION */}

                  <div className="quiz-navigation">

                    <button
                      type="button"
                      className="previous-button"
                      disabled={
                        currentQuestionIndex ===
                        0 ||
                        isSubmitting
                      }
                      onClick={
                        handlePreviousQuestion
                      }
                    >
                      ← Previous
                    </button>

                    {/* QUESTION DOTS */}

                    <div className="question-progress">

                      {quizQuestions.map(
                        (
                          question,
                          index
                        ) => (

                          <button
                            key={
                              question.id
                            }
                            type="button"
                            className={
                              index ===
                              currentQuestionIndex
                                ? "question-dot active"
                                : selectedAnswers[
                                    question.id
                                  ]
                                ? "question-dot answered"
                                : "question-dot"
                            }
                            onClick={() =>
                              setCurrentQuestionIndex(
                                index
                              )
                            }
                            disabled={
                              isSubmitting
                            }
                          >
                            {index +
                              1}
                          </button>

                        )
                      )}

                    </div>

                    {/* NEXT / SUBMIT */}

                    {currentQuestionIndex <
                    quizQuestions.length -
                      1 ? (

                      <button
                        type="button"
                        className="next-button"
                        onClick={
                          handleNextQuestion
                        }
                        disabled={
                          isSubmitting
                        }
                      >
                        Next →
                      </button>

                    ) : (

                      <button
                        type="button"
                        className="submit-quiz-button"
                        onClick={() =>
                          handleSubmitQuiz(
                            false
                          )
                        }
                        disabled={
                          isQuizSubmitted ||
                          isSubmitting
                        }
                      >

                        {isSubmitting
                          ? "Submitting..."
                          : "Submit Quiz ✓"}

                      </button>

                    )}

                  </div>

                </div>
              )}

            {/* =====================================
                SUBMITTED
            ===================================== */}

{isQuizSubmitted && submittedResult && (
  <div className="quiz-submitted-card">

    <div className="success-icon">
      ✓
    </div>

    <h2>
      Quiz Submitted!
    </h2>

    <p>
      Your quiz has been submitted successfully.
    </p>

    <div className="submitted-result-summary">

      <div className="submitted-result-item">
        <span>Score</span>

        <strong>
          {submittedResult.score}/
          {submittedResult.total_questions}
        </strong>
      </div>

      <div className="submitted-result-item">
        <span>Percentage</span>

        <strong>
          {submittedResult.total_questions > 0
            ? Math.round(
                (submittedResult.score /
                  submittedResult.total_questions) *
                  100
              )
            : 0}
          %
        </strong>
      </div>

      <div className="submitted-result-item">
        <span>Status</span>

        <strong
          className={
            submittedResult.result_status === "PASS" ||
            submittedResult.result_status === "Pass"
              ? "result-pass"
              : "result-fail"
          }
        >
          {submittedResult.result_status}
        </strong>
      </div>

    </div>

    <button
      type="button"
      onClick={handleBackToMyQuizzes}
    >
      Back to My Quizzes
    </button>

  </div>
)}

          </section>
        )}

        {/* =====================================
            MY RESULTS
        ===================================== */}

        {/* =====================================
    MY RESULTS
===================================== */}

{activePage === "My Results" && (
  <section className="page-section">

    <div className="section-heading">
      <div>
        <h2>My Results</h2>

        <p>
          View your quiz performance and scores.
        </p>
      </div>

      <button
        type="button"
        className="refresh-results-button"
        onClick={fetchMyResults}
        disabled={loadingResults}
      >
        {loadingResults ? "Refreshing..." : "Refresh"}
      </button>
    </div>

    {/* LOADING */}

    {loadingResults && (
      <div className="glass-message">
        Loading your results...
      </div>
    )}

    {/* ERROR */}

    {resultsError && (
      <div className="glass-message error">
        {resultsError}
      </div>
    )}

    {/* NO RESULTS */}

    {!loadingResults &&
      !resultsError &&
      myResults.length === 0 && (
        <div className="result-coming-card">

          <div className="result-icon">
            ◔
          </div>

          <h3>
            No Results Yet
          </h3>

          <p>
            Your quiz results will appear here
            after you submit a quiz.
          </p>

        </div>
      )}

    {/* RESULTS */}

    {!loadingResults &&
      !resultsError &&
      myResults.length > 0 && (

        <div className="results-list">

          {myResults.map((result) => {

            const score = Number(result.score) || 0;

            const totalQuestions =
              Number(result.total_questions) || 0;

            const percentage =
              totalQuestions > 0
                ? Math.round(
                    (score / totalQuestions) * 100
                  )
                : 0;

                const status = getResultStatus(result);

            return (
              <div
                className="student-result-card"
                key={result.attempt_id}
              >

                {/* QUIZ ICON */}

                <div className="result-quiz-icon">
                  ◔
                </div>

                {/* QUIZ INFORMATION */}

                <div className="result-quiz-info">

                  <h3>
                    {result.title}
                  </h3>

                  <p>
                    {result.description ||
                      "Quiz completed successfully."}
                  </p>

                  <span>
                    Submitted:{" "}
                    {result.submitted_at
                      ? new Date(
                          result.submitted_at
                        ).toLocaleString()
                      : "—"}
                  </span>

                </div>

                {/* SCORE */}
{/* ATTEMPT HISTORY DETAILS */}

<div className="attempt-history-details">

  <div className="attempt-history-stat">
    <span>Score</span>
    <strong>
      {score}/{totalQuestions}
    </strong>
  </div>

  <div className="attempt-history-stat">
    <span>Percentage</span>
    <strong>
      {percentage}%
    </strong>
  </div>

  <div className="attempt-history-stat">
    <span>Status</span>

    <strong
      className={
        status === "PASS" ||
        status === "Pass"
          ? "result-pass"
          : "result-fail"
      }
    >
      {status}
    </strong>
  </div>

  <div className="attempt-history-stat">
    <span>Attempted On</span>

    <strong>
      {result.submitted_at
        ? new Date(
            result.submitted_at
          ).toLocaleString()
        : "—"}
    </strong>
  </div>

</div>
                <button
  type="button"
  className="review-answers-button"
  onClick={() =>
    fetchAttemptReview(result.attempt_id)
  }
>
  Review Answers
</button>

              </div>
            );
          })}

        </div>
      )}

      {loadingReview && (
  <div className="glass-message">
    Loading answer review...
  </div>
)}

{reviewError && (
  <div className="glass-message error">
    {reviewError}
  </div>
)}

{selectedAttemptReview && (
  <div className="answer-review-section">

    <div className="section-heading">
      <div>
        <h2>Answer Review</h2>

        <p>
          {selectedAttemptReview.attempt.quiz_title}
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          setSelectedAttemptReview(null)
        }
      >
        Close Review
      </button>
    </div>

    {selectedAttemptReview.review.map(
      (item, index) => (
        <div
          className={
            item.is_correct
              ? "answer-review-card correct"
              : "answer-review-card incorrect"
          }
          key={item.question_id}
        >
          <h3>
            Question {index + 1}
          </h3>

          <p>
            {item.question_text}
          </p>

          <div className="review-answer-row">
            <span>Your Answer</span>

            <strong>
              {item.selected_option_text ||
                "Not Answered"}
            </strong>
          </div>

          <div className="review-answer-row">
            <span>Correct Answer</span>

            <strong>
              {item.correct_option_text}
            </strong>
          </div>

          <div className="review-status">
            {item.is_correct
              ? "✓ Correct"
              : "✕ Incorrect"}
          </div>
          {item.explanation && (
  <div className="review-explanation">

    <strong>
      Explanation
    </strong>

    <p>
      {item.explanation}
    </p>

  </div>
)}
        </div>
      )
    )}

  </div>
)}

  </section>
)}

        {/* =====================================
            PROFILE
        ===================================== */}

        {activePage ===
          "Profile" && (
          <section className="page-section">

            <h2>
              Profile
            </h2>

            <div className="profile-card">

              <div className="large-profile-avatar">
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  "S"}
              </div>

              <h2>
                {user?.name}
              </h2>

              <p>
                {user?.email}
              </p>

              <span>
                Student
              </span>

            </div>

          </section>
        )}

        {/* =====================================
            SETTINGS
        ===================================== */}

        {activePage ===
          "Settings" && (
          <section className="page-section">

            <h2>
              Settings
            </h2>

            <div className="settings-card">

              <h3>
                Account Settings
              </h3>

              <p>
                Your account settings
                will be available
                here.
              </p>

            </div>

          </section>
        )}

      </main>
    </div>
  );
}

export default StudentDashboard;