import React, { useState } from "react";
import "../styles/Login.css";
import PopupCard from "../components/Popupcard";

type PopupType = "success" | "error";

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [popupMessage, setPopupMessage] = useState<string>("");
  const [popupType, setPopupType] = useState<PopupType>("error");

  const toBase64 = (str: string): string => {
    return window.btoa(unescape(encodeURIComponent(str)));
  };

  const isPasswordSecure = (pw: string): boolean => {
    return (
      pw.length >= 8 &&
      /[A-Z]/.test(pw) &&
      /[a-z]/.test(pw) &&
      /[0-9]/.test(pw) &&
      /[^A-Za-z0-9]/.test(pw)
    );
  };

  const getPasswordStrength = (pw: string): number => {
    let strength = 0;
    if (pw.length >= 8) strength++;
    if (/[A-Z]/.test(pw)) strength++;
    if (/[0-9]/.test(pw)) strength++;
    if (/[^A-Za-z0-9]/.test(pw)) strength++;
    return strength;
  };

  const getStrengthLabel = (level: number): { text: string; color: string } => {
    if (level <= 1) return { text: "Weak", color: "red" };
    if (level === 2 || level === 3) return { text: "Medium", color: "orange" };
    return { text: "Strong", color: "green" };
  };

  const inputStyle = (valid: boolean): React.CSSProperties => ({
    border: valid ? "1px solid #ccc" : "2px solid red",
    borderRadius: "4px",
    padding: "10px",
    fontSize: "1rem",
    width: "100%",
    marginBottom: valid ? "1.5rem" : "0.25rem",
    outline: "none",
  });

  const passwordsMatch = password === confirmPassword;
  const passwordSecure = isPasswordSecure(password);
  const passwordStrength = getPasswordStrength(password);
  const isUsernameValid = username.length >= 6;
  const strengthLabel = getStrengthLabel(passwordStrength);

  const canRegister =
  isUsernameValid &&
  password &&
  confirmPassword &&
  passwordsMatch &&
  passwordStrength >= 3; // Medium ขึ้นไป


  const handleRegister = (): void => {
    setPopupMessage("");

    if (!isUsernameValid) {
      setPopupMessage("Username must be at least 6 characters.");
      setPopupType("error");
      return;
    }

    if (!canRegister) {
      setPopupMessage("Please fill in all fields correctly.");
      setPopupType("error");
      return;
    }

    const payload = {
      username,
      password: toBase64(password),
    };

    fetch("http://localhost:8080/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Registration failed.");
      })
      .then(() => {
        setPopupMessage("Registration successful! Redirecting...");
        setPopupType("success");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      })
      .catch((err: Error) => {
        setPopupMessage(err.message);
        setPopupType("error");
      });
  };

  return (
    <div
      className="login-page"
      style={{
      }}
    >
      {popupMessage && (
        <PopupCard
          message={popupMessage}
          type={popupType}
          onClose={() => setPopupMessage("")}
        />
      )}

      <div className="login-card">
        <h2 className="login-title">Create an Account</h2>

        <input
          className="login-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            const input = e.target.value;
            if (!/[ก-๙]/.test(input)) {
              setUsername(input);
            }
          }}
          style={inputStyle(isUsernameValid || username.length === 0)}
        />
        {!isUsernameValid && username.length > 0 && (
          <p style={{ color: "red", fontSize: "0.85rem", marginTop: 0, marginBottom: "1rem" }}>
            ⚠️ Username must be at least 6 characters.
          </p>
        )}

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle(passwordSecure || password.length === 0)}
        />

        {password && (
          <div style={{ width: "100%", marginBottom: "1rem" }}>
            <div style={{ height: "8px", backgroundColor: "#eee", borderRadius: "4px" }}>
              <div
                style={{
                  width: `${(passwordStrength / 4) * 100}%`,
                  height: "100%",
                  backgroundColor: strengthLabel.color,
                  borderRadius: "4px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <p style={{ fontSize: "0.85rem", color: strengthLabel.color, marginTop: "4px" }}>
              Password strength: {strengthLabel.text}
            </p>
          </div>
        )}

        {passwordStrength < 3 && password.length > 0 && (
          <p style={{ color: "red", fontSize: "0.85rem", marginTop: 0, marginBottom: "1rem" }}>
            ⚠️ Password must be at least 8 characters, with uppercase, number, and special character.
          </p>
        )}


        <input
          className="login-input"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle(passwordsMatch || confirmPassword.length === 0)}
        />

        {confirmPassword && !passwordsMatch && (
          <p style={{ color: "red", fontSize: "0.85rem", marginTop: 0, marginBottom: "1rem" }}>
            ⚠️ Passwords do not match.
          </p>
        )}

        <button
          className="login-button"
          onClick={handleRegister}
          disabled={!canRegister}
          style={{
            backgroundColor: canRegister ? "#0070f3" : "#aaa",
            cursor: canRegister ? "pointer" : "not-allowed",
          }}
        >
          Register
        </button>

        <button className="register-button" onClick={() => (window.location.href = "/")}>
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Register;
