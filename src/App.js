import React, { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    // Add user message
    const userMsg = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("https://studyai-backend-5wig.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      const aiMsg = {
        sender: "ai",
        text: data.answer || data.error || "No response received.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Unable to connect to backend." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🎓 StudyAI Chatbot</h1>

      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor:
                msg.sender === "user" ? "#007bff" : "#f1f1f1",
              color: msg.sender === "user" ? "white" : "black",
            }}
          >
            {msg.text}
          </div>
        ))}

        {loading && <div style={styles.typing}>AI is typing...</div>}
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Ask me anything..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
        />
        <button onClick={handleAsk} style={styles.button} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "600px",
    margin: "50px auto",
    fontFamily: "Arial",
    display: "flex",
    flexDirection: "column",
  },
  heading: {
    textAlign: "center",
    color: "#007bff",
    marginBottom: "20px",
  },
  chatBox: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    height: "400px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  message: {
    maxWidth: "70%",
    padding: "10px",
    borderRadius: "10px",
  },
  typing: {
    fontStyle: "italic",
    color: "gray",
  },
  inputArea: {
    display: "flex",
    marginTop: "15px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    marginLeft: "10px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default App;
