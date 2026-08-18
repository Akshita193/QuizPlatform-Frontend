import { useState } from "react";
import "./Login.css";

function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5001/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage("Registration successful! You can now login.");

      setName("");
      setEmail("");
      setPassword("");

      if (onRegister) {
        onRegister();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
  <div className="login-page">

    <div className="login-visual">

      <div className="login-brand-badge">
        🎓
        <span>QuizPlatform</span>
      </div>

      <div className="login-visual-content">

        <span className="login-eyebrow">
          START • LEARN • GROW
        </span>

        <h1>
          Begin your journey with
          <span> QuizPlatform</span>
        </h1>

        <p>
          Create your student account,
          attempt quizzes, review answers
          and track your performance.
        </p>

        <div className="login-feature-list">

          <div>
            <span>✓</span>
            Practice with quizzes
          </div>

          <div>
            <span>✓</span>
            Track your scores
          </div>

          <div>
            <span>✓</span>
            Review your answers
          </div>

        </div>

      </div>

      <div className="login-decoration login-decoration-one"></div>
      <div className="login-decoration login-decoration-two"></div>

    </div>


    <div className="login-form-side">

      <form
        className="login-card"
        onSubmit={handleRegister}
      >

        <div className="login-mobile-brand">
          🎓 QuizPlatform
        </div>

        <div className="login-heading">

          <span>CREATE ACCOUNT</span>

          <h2>
            Student Registration
          </h2>

          <p>
            Enter your details to create your account.
          </p>

        </div>


        {/* NAME */}

        <div className="login-field">

          <label htmlFor="register-name">
            Full Name
          </label>

          <div className="login-input-wrapper">

            <span className="login-input-icon">
              ♙
            </span>

            <input
              id="register-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />

          </div>

        </div>


        {/* EMAIL */}

        <div className="login-field">

          <label htmlFor="register-email">
            Email Address
          </label>

          <div className="login-input-wrapper">

            <span className="login-input-icon">
              ✉
            </span>

            <input
              id="register-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

        </div>


        {/* PASSWORD */}

        <div className="login-field">

          <label htmlFor="register-password">
            Password
          </label>

          <div className="login-input-wrapper">

            <span className="login-input-icon">
              🔒
            </span>

            <input
              id="register-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

        </div>


        {/* ERROR */}

        {error && (
          <div className="login-error-message">
            {error}
          </div>
        )}


        {/* SUCCESS */}

        {message && (
          <div className="register-success-message">
            {message}
          </div>
        )}


        {/* REGISTER */}

        <button
          type="submit"
          className="login-primary-button"
        >
          Create Account
        </button>


        <div className="login-divider">

          <span></span>

          <p>
            Already have an account?
          </p>

          <span></span>

        </div>


        {/* BACK TO LOGIN */}

        <button
          type="button"
          onClick={onRegister}
          className="login-secondary-button"
        >
          Back to Login
        </button>

      </form>

    </div>

  </div>
);
}

export default Register;