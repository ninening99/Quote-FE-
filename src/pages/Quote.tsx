import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Quote.css";
import PopupInput from "../components/Popupinput";
import ConfirmPopup from "../components/Popupconfirm";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface QuoteType {
  id: number;
  text: string;
  author: string;
  vote_count: number;
  created_at: string;
  updated_at: string;
}

function Quote() {
  const [quotes, setQuotes] = useState<QuoteType[]>([]);
  const [topQuotes, setTopQuotes] = useState<QuoteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupText, setPopupText] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [sorting, setSorting] = useState(true);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const updateTopQuotes = (list: QuoteType[]) => {
    const sorted = [...list]
      .sort((a, b) => b.vote_count - a.vote_count)
      .slice(0, 5);
    setTopQuotes(sorted);
  };


  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in first.");

      const query = new URLSearchParams({
        search: searchTerm,
        filter,
        sorting: sorting.toString(),
      });

      const response = await fetch(
        `http://localhost:8080/api/quotes/search?${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error("Failed to fetch quotes.");
      }

      const data: QuoteType[] = await response.json();
      setQuotes(data);
      updateTopQuotes(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      if (message.includes("log in")) {
        alert(message);
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      fetchQuotes();
    }, 400);

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [searchTerm, filter, sorting]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

 const handleVote = async (id: number) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Please log in first.");

    const response = await fetch("http://localhost:8080/api/quotes/vote", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quote_id: id }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Session expired. Please log in again.");
      }
      throw new Error("Failed to vote.");
    }

    // ✅ ดึงข้อมูลใหม่จาก backend หลังโหวตสำเร็จ
    await fetchQuotes();
  } catch (err: any) {
    alert(err.message);
  }
};



  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId === null) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in first.");

      const response = await fetch(
        `http://localhost:8080/api/quotes/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete quote");

      const updated = quotes.filter((q) => q.id !== deleteId);
      setQuotes(updated);
      updateTopQuotes(updated);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setDeleteId(null);
  };

  const openCreatePopup = () => {
    setPopupTitle("Create Quote");
    setPopupText("");
    setEditId(null);
    setIsPopupOpen(true);
  };

  const openEditPopup = (id: number, text: string, voteCount: number) => {
    if (voteCount > 0) {
      alert("Cannot edit a quote that has votes");
      return;
    }
    setPopupTitle("Edit Quote");
    setPopupText(text);
    setEditId(id);
    setIsPopupOpen(true);
  };

  const handlePopupSave = async () => {
    if (!popupText.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in first.");

      if (editId === null) {
        const response = await fetch("http://localhost:8080/api/quotes", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: popupText }),
        });
        if (!response.ok) throw new Error("Failed to create quote");

        await fetchQuotes();
      } else {
        const response = await fetch(
          `http://localhost:8080/api/quotes-update/${editId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: popupText }),
          }
        );
        if (!response.ok) throw new Error("Failed to update quote");

        await fetchQuotes();
      }
    } catch (err: any) {
      alert(err.message);
    }

    setIsPopupOpen(false);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="loading error">{error}</div>;

  return (
    <div className="quote-container">
      <div className="header">
        <h1>Quotes</h1>
        <div className="header-right">
          <button onClick={handleLogout} className="logout-button">
            Log out
          </button>
        </div>
      </div>

      <div className="controls">
        <button onClick={openCreatePopup}>Create</button>

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginLeft: "1rem" }}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginLeft: "1rem" }}
        >
          <option value="">All</option>
          <option value="have">Only voted</option>
          <option value="no">Only no vote</option>
        </select>

        <button
          onClick={() => setSorting((prev) => !prev)}
          style={{ marginLeft: "1rem" }}
        >
          Sort: {sorting ? "Descending" : "Ascending"}
        </button>
      </div>

      <div className="main-content">
        <div className="quote-list">
          {quotes.map((quote) => (
            <div key={quote.id} className="quote-card">
              <div className="quote-content">
                <p className="quote-text">"{quote.text}"</p>
                <p className="quote-author">- {quote.author}</p>
              </div>
              <div className="quote-actions">
                <div className="vote-count">{quote.vote_count} votes</div>
                <button
                  className="vote-button"
                  onClick={() => handleVote(quote.id)}
                >
                  Vote
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteClick(quote.id)}
                >
                  Delete
                </button>
                {quote.vote_count === 0 && (
                  <button
                    className="edit-button"
                    onClick={() =>
                      openEditPopup(quote.id, quote.text, quote.vote_count)
                    }
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="chart-section">
          <h2>Top Voted Quotes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topQuotes}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="text"
                type="category"
                tick={{ fontSize: 12 }}
                width={200}
              />
              <Tooltip />
              <Bar dataKey="vote_count" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {isPopupOpen && (
        <PopupInput
          title={popupTitle}
          value={popupText}
          onChange={setPopupText}
          onCancel={() => setIsPopupOpen(false)}
          onSave={handlePopupSave}
        />
      )}

      {isConfirmOpen && (
        <ConfirmPopup
          message="Are you sure you want to delete this quote?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

export default Quote;
