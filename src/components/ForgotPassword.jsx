import { useState } from "react";
import "./Login.css";

function ForgotPassword({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetting, setResetting] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setResetting(true);

      const response = await fetch(
        "http://localhost:5001/api/auth/reset-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to reset password"
        );
      }

      setMessage(
        "Password reset successfully. You can now login."
      );

      setEmail("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      setError(error.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}

      <div className="login-visual">

        <div className="login-brand-badge">
          🎓
          <span>QuizPlatform</span>
        </div>

        <div className="login-visual-content">

          <span className="login-eyebrow">
            ACCOUNT RECOVERY
          </span>

          <h1>
            Reset your
            <span> password</span>
          </h1>

          <p>
            Enter your registered email
            address and create a new password
            to regain access to your account.
          </p>

          <div className="login-feature-list">

            <div>
              <span>✓</span>
              Simple password recovery
            </div>

            <div>
              <span>✓</span>
              Secure password hashing
            </div>

            <div>
              <span>✓</span>
              Continue your learning journey
            </div>

          </div>

        </div>

        <div className="login-decoration login-decoration-one"></div>
        <div className="login-decoration login-decoration-two"></div>

      </div>


      {/* RIGHT SIDE */}

      <div className="login-form-side">

        <form
          className="login-card"
          onSubmit={handleResetPassword}
        >

          <div className="login-mobile-brand">
            🎓 QuizPlatform
          </div>

          <div className="login-heading">

            <span>FORGOT PASSWORD</span>

            <h2>
              Reset your password
            </h2>

            <p>
              Enter your account details below.
            </p>

          </div>


          {/* EMAIL */}

          <div className="login-field">

            <label htmlFor="reset-email">
              Email Address
            </label>

            <div className="login-input-wrapper">

              <span className="login-input-icon">
                ✉
              </span>

              <input
                id="reset-email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

          </div>


          {/* NEW PASSWORD */}

          <div className="login-field">

            <label htmlFor="new-password">
              New Password
            </label>

            <div className="login-input-wrapper">

              <span className="login-input-icon">
                🔒
              </span>

              <input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                minLength="6"
                required
              />

            </div>

          </div>


          {/* CONFIRM PASSWORD */}

          <div className="login-field">

            <label htmlFor="confirm-password">
              Confirm Password
            </label>

            <div className="login-input-wrapper">

              <span className="login-input-icon">
                🔒
              </span>

              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                minLength="6"
                required
              />

            </div>

          </div>


          {error && (
            <div className="login-error-message">
              {error}
            </div>
          )}


          {message && (
            <div className="register-success-message">
              {message}
            </div>
          )}


          <button
            type="submit"
            className="login-primary-button"
            disabled={resetting}
          >
            {resetting
              ? "Resetting..."
              : "Reset Password"}
          </button>


          <div className="login-divider">

            <span></span>

            <p>
              Remember your password?
            </p>

            <span></span>

          </div>


          <button
            type="button"
            className="login-secondary-button"
            onClick={onBackToLogin}
          >
            Back to Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default ForgotPassword;