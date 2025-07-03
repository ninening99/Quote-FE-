import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Quote from "./pages/Quote";

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <main className="App-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/quote" element={<Quote />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default App;
