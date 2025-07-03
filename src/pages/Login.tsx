import React, { useState } from "react";
import "../styles/Login.css";
import PopupCard from "../components/Popupcard";
type PopupType = "success" | "error";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [popupMessage, setPopupMessage] = useState<string>("");
  const [popupType, setPopupType] = useState<PopupType>("error");

  const handleLogin = (): void => {
    setPopupMessage("");

    if (!username.trim() || !password.trim()) {
      setPopupMessage("Please enter both username and password");
      setPopupType("error");
      return;
    }

    const encodedPassword = btoa(unescape(encodeURIComponent(password)));

    const payload = {
      username,
      password: encodedPassword,
    };

    fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid username or password");
        return res.json();
      })
      .then((data: { token: string; username: string; role: string }) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);

        setPopupMessage("Login successful! Redirecting...");
        setPopupType("success");

        setTimeout(() => {
          window.location.href = "/quote";
        }, 1500);
      })
      .catch((err: Error) => {
        setPopupMessage(err.message);
        setPopupType("error");
        console.error("Login error:", err);
      });
  };

  const handleRegister = (): void => {
    window.location.href = "/register";
  };

  return (
    <div
      className="login-page"
      style={{ }}
    >
      {popupMessage && (
        <PopupCard
          message={popupMessage}
          type={popupType}
          onClose={() => setPopupMessage("")}
        />
      )}

      <div className="login-card">
        <h1
          className="login-title"
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Quote
        </h1>

        <input
          className="login-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const input = e.target.value;
            if (!/[ก-๙]/.test(input)) {
              setUsername(input);
            }
          }}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>

        <button className="register-button" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
