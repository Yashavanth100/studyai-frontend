import React, { useState, useRef, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMsg = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "https://studyai-backend-5wig.onrender.com"}/ask`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        }
      );

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
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>🎓 StudyAI</h1>
        <p style={styles.subHeading}>Smart Learning Assistant</p>

        <div style={styles.chatBox}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...styles.message,
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                background:
                  msg.sender === "user"
                    ? "linear-gradient(135deg, #007bff, #00c6ff)"
                    : "rgba(255, 255, 255, 0.8)",
                color: msg.sender === "user" ? "white" : "#222",
                boxShadow:
                  msg.sender === "user"
                    ? "0 4px 12px rgba(0,123,255,0.3)"
                    : "0 4px 10px rgba(0,0,0,0.1)",
                animation: "fadeIn 0.5s ease",
              }}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div style={styles.typing}>
              <div style={styles.dot}></div>
              <div style={styles.dot}></div>
              <div style={styles.dot}></div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div style={styles.inputArea}>
          <input
            type="text"
            placeholder="Ask your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={styles.input}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          />
          <button
            onClick={handleAsk}
            style={{
              ...styles.button,
              background: loading
                ? "linear-gradient(135deg, #ccc, #999)"
                : "linear-gradient(135deg, #007bff, #00c6ff)",
            }}
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>

      {/* Background floating gradient effect */}
      <div style={styles.gradient1}></div>
      <div style={styles.gradient2}></div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #b2fefa 0%, #0ed2f7 100%)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "700px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "20px",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
    padding: "25px",
    zIndex: 2,
  },
  heading: {
    textAlign: "center",
    fontSize: "2rem",
    color: "#003366",
    marginBottom: "5px",
  },
  subHeading: {
    textAlign: "center",
    color: "#004d66",
    marginBottom: "20px",
    fontWeight: 500,
  },
  chatBox: {
    background: "rgba(255, 255, 255, 0.4)",
    borderRadius: "16px",
    padding: "15px",
    height: "420px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: "inset 0 0 8px rgba(0,0,0,0.1)",
  },
  message: {
    maxWidth: "80%",
    padding: "12px 16px",
    borderRadius: "18px",
    fontSize: "15px",
    transition: "transform 0.3s ease",
  },
  typing: {
    display: "flex",
    gap: "6px",
    marginLeft: "10px",
    marginTop: "5px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#007bff",
    animation: "blink 1.2s infinite",
  },
  inputArea: {
    display: "flex",
    marginTop: "20px",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.5)",
    background: "rgba(255,255,255,0.6)",
    fontSize: "16px",
    outline: "none",
    color: "#222",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  button: {
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "12px 20px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  gradient1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, #00c6ff 0%, transparent 70%)",
    top: "10%",
    left: "5%",
    zIndex: 1,
    opacity: 0.5,
    animation: "float 6s ease-in-out infinite",
  },
  gradient2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, #b2fefa 0%, transparent 70%)",
    bottom: "10%",
    right: "5%",
    zIndex: 1,
    opacity: 0.4,
    animation: "float 8s ease-in-out infinite reverse",
  },
};

// Animations
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes blink {
  0% { opacity: 0.2; }
  50% { opacity: 1; }
  100% { opacity: 0.2; }
}`, styleSheet.cssRules.length);

styleSheet.insertRule(`
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}`, styleSheet.cssRules.length);

export default App;
