import { useState } from "react";
import "./Auth.css";

function ForgotPassword() {

  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {

    if (!phone || !newPassword) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            phone,
            newPassword
          })
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Password updated ✅ Redirecting to login...");

        // ✅ REDIRECT AFTER SUCCESS
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);

      } else {
        setError(data.message || "Something went wrong");
      }

    } catch {
      setError("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h2>Forgot Password</h2>

        <label>Phone Number</label>
        <input
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setError("");
          }}
        />

        <label>New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setError("");
          }}
        />

        {/* ✅ ERROR */}
        {error && <p className="error-msg">{error}</p>}

        {/* ✅ SUCCESS */}
        {message && <p className="success-msg">{message}</p>}

        <button onClick={handleReset}>
          {loading ? "Updating..." : "Reset Password"}
        </button>

      </div>
    </div>
  );
}

export default ForgotPassword;