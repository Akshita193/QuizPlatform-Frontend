import { useEffect, useState } from "react";

function StudentDashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState("Dashboard");

  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [quizError, setQuizError] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionError, setQuestionError] = useState("");

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    if (activePage === "Quizzes") {
      fetchPublishedQuizzes();
    }
  }, [activePage]);

  useEffect(() => {
  if (activePage !== "QuizQuestions") {
    return;
  }

  if (quizSubmitted) {
    return;
  }

  if (timeLeft <= 0) {
    submitQuiz();
    return;
  }

  const timer = setInterval(() => {
    setTimeLeft((previousTime) => previousTime - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [activePage, timeLeft, quizSubmitted]);

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
      console.error("Fetch published quizzes error:", error);
      setQuizError(error.message);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const startQuiz = async () => {
  if (!selectedQuiz) {
    return;
  }

  setLoadingQuestions(true);
  setQuestionError("");

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5001/api/quizzes/${selectedQuiz.id}/questions`,
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
        data.message || "Failed to load quiz questions"
      );
    }
    setTimeLeft(600);
    setQuizQuestions(data.questions || []);
    setCurrentQuestionIndex(0);
    setActivePage("QuizQuestions");
  } catch (error) {
    console.error("Start quiz error:", error);
    setQuestionError(error.message);
  } finally {
    setLoadingQuestions(false);
  }
};

const handleAnswerSelect = (questionId, optionId) => {
  setSelectedAnswers((previousAnswers) => ({
    ...previousAnswers,
    [questionId]: optionId,
  }));
};

const submitQuiz = async () => {
  if (isSubmitting || quizSubmitted) {
    return;
  }

  setIsSubmitting(true);

  try {
    console.log("Submitting quiz...");
    console.log("Selected answers:", selectedAnswers);

    // Temporary for now.
    // We will connect this to the backend submission
    // endpoint after the UI flow is working.

    setQuizSubmitted(true);

    alert("Quiz submitted successfully!");
  } catch (error) {
    console.error("Submit quiz error:", error);
    alert("Failed to submit quiz.");
  } finally {
    setIsSubmitting(false);
  }
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>QuizPlatform</h2>

        <p className="sidebar-role">Student</p>

        <button
          onClick={() => setActivePage("Dashboard")}
          className={activePage === "Dashboard" ? "active" : ""}
        >
          Dashboard
        </button>

        <button
          onClick={() => setActivePage("Quizzes")}
          className={activePage === "Quizzes" ? "active" : ""}
        >
          Quizzes
        </button>

        <button
          onClick={() => setActivePage("Results")}
          className={activePage === "Results" ? "active" : ""}
        >
          My Results
        </button>

        <button onClick={onLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h1>{activePage}</h1>

            <p>
              Welcome, {user?.name || "Student"}!
            </p>
          </div>
        </header>

        {activePage === "Dashboard" && (
          <section className="dashboard-placeholder">
            <h2>Student Dashboard</h2>

            <p>
              Welcome to QuizPlatform. Choose a quiz to get started.
            </p>
          </section>
        )}

        {activePage === "QuizDetails" && selectedQuiz && (
  <section className="dashboard-placeholder">
    <button
      type="button"
      onClick={() => {
        setSelectedQuiz(null);
        setActivePage("Quizzes");
      }}
    >
      ← Back to Quizzes
    </button>

    <h2>{selectedQuiz.title}</h2>

    <p>
      {selectedQuiz.description ||
        "No description available."}
    </p>

    <div className="quiz-details-card">
      <h3>Quiz Details</h3>

      <p>
        <strong>Quiz ID:</strong> {selectedQuiz.id}
      </p>

      <p>
        <strong>Status:</strong> Published
      </p>

      <button
  type="button"
  onClick={startQuiz}
  disabled={loadingQuestions}
>
  {loadingQuestions ? "Loading..." : "Start Quiz"}
</button>
    </div>
  </section>
)}

        {activePage === "Quizzes" && (
          <section className="dashboard-placeholder">
            <h2>Available Quizzes</h2>

            {loadingQuizzes && (
              <p>Loading quizzes...</p>
            )}

            {quizError && (
              <p className="error-message">
                {quizError}
              </p>
            )}

            {!loadingQuizzes &&
              !quizError &&
              quizzes.length === 0 && (
                <p>
                  No quizzes are currently available.
                </p>
              )}

            {!loadingQuizzes &&
              !quizError &&
              quizzes.length > 0 && (
                <div className="quiz-list">
                  {quizzes.map((quiz) => (
                    <div
                      className="quiz-card"
                      key={quiz.id}
                    >
                      <h3>{quiz.title}</h3>

                      <p>
                        {quiz.description ||
                          "No description available."}
                      </p>

                      <button
  type="button"
  onClick={() => {
    setSelectedQuiz(quiz);
    setActivePage("QuizDetails");
  }}
>
  Start Quiz
</button>
                    </div>
                  ))}
                </div>
              )}
          </section>
        )}

        {activePage === "QuizQuestions" && (
  <section className="dashboard-placeholder">
    {questionError && (
      <p className="error-message">
        {questionError}
      </p>
    )}

    {loadingQuestions && (
      <p>Loading questions...</p>
    )}

    {!loadingQuestions &&
      !questionError &&
      quizQuestions.length > 0 && (
        <>
        <div className="quiz-timer">
  Time Left: {formatTime(timeLeft)}
</div>
          <h2>
            Question {currentQuestionIndex + 1} of{" "}
            {quizQuestions.length}
          </h2>

          <div className="quiz-question-card">
            <h3>
              {
                quizQuestions[currentQuestionIndex]
                  .question_text
              }
            </h3>

            <div className="quiz-options">
  {quizQuestions[
    currentQuestionIndex
  ].options.map((option) => {
    const currentQuestion =
      quizQuestions[currentQuestionIndex];

    const isSelected =
      selectedAnswers[currentQuestion.id] === option.id;

    return (
      <button
        key={option.id}
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
      >
        {option.option_text}
      </button>
    );
  })}
</div>

            <div className="quiz-navigation">
  <button
    type="button"
    onClick={() => {
  if (currentQuestionIndex > 0) {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  }
}}
    disabled={currentQuestionIndex === 0}
  >
    Previous
  </button>

  <button
    type="button"
    onClick={() => {
  if (currentQuestionIndex < quizQuestions.length - 1) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }
}}
    disabled={
      currentQuestionIndex ===
      quizQuestions.length - 1
    }
  >
    Next
  </button>
</div>

<div className="quiz-submit-container">
  <button
    type="button"
    className="submit-quiz-button"
    onClick={submitQuiz}
    disabled={isSubmitting || quizSubmitted}
  >
    {isSubmitting
      ? "Submitting..."
      : quizSubmitted
      ? "Quiz Submitted"
      : "Submit Quiz"}
  </button>
</div>
          </div>
        </>
      )}
  </section>
)}

        {activePage === "Results" && (
          <section className="dashboard-placeholder">
            <h2>My Results</h2>

            <p>
              Your quiz results will appear here.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;