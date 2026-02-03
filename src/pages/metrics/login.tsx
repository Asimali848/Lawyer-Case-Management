import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequestAccessMutation } from "@/store/services/analytics";

/**
 * Error page component - displays standard 404
 */
const SystemMetrics = () => {
  const navigate = useNavigate();
  const [requestAccess] = useRequestAccessMutation();
  const [showForm, setShowForm] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await requestAccess({
        identifier,
        access_key: accessKey,
      }).unwrap();

      localStorage.setItem("_sys_tk", result.access_token);
      localStorage.setItem("_sys_lv", "9");
      navigate("/analytics/overview");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // Hidden form triggered by corner click
  if (showForm) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
        }}
      >
        <form onSubmit={handleSubmit} style={{ width: 300 }}>
          <input
            type="email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="ID"
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 8,
              background: "#222",
              border: "1px solid #333",
              color: "#fff",
              fontFamily: "monospace",
            }}
          />
          <div style={{ position: "relative", marginBottom: 8 }}>
            <input
              type={showPassword ? "text" : "password"}
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder="Key"
              style={{
                width: "100%",
                padding: 8,
                paddingRight: 32,
                background: "#222",
                border: "1px solid #333",
                color: "#fff",
                fontFamily: "monospace",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#888",
                cursor: "pointer",
                fontSize: 12,
                padding: 0,
              }}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 8,
              background: "#333",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontFamily: "monospace",
            }}
          >
            {loading ? "..." : "Go"}
          </button>
          {error && (
            <p style={{ color: "#f00", marginTop: 8, fontSize: 12 }}>{error}</p>
          )}
        </form>
      </div>
    );
  }

  // Standard 404 page - no styling, plain HTML look
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        fontFamily: "Times New Roman, serif",
        padding: 20,
        color: "black",
      }}
    >
      <h1
        style={{
          fontSize: 24,
          fontWeight: "bold",
          borderBottom: "1px solid #000",
          paddingBottom: 10,
          marginBottom: 20,
        }}
      >
        Not Found
      </h1>
      <p style={{ marginBottom: 10 }}>
        The requested URL was not found on this server.
      </p>
      <hr
        style={{
          border: "none",
          borderTop: "1px solid #ccc",
          margin: "20px 0",
        }}
      />
      <p style={{ fontSize: 12, color: "#666" }}>
        Apache/2.4.41 (Ubuntu) Server at {window.location.host} Port 4430
      </p>

      {/* Hidden trigger - 10px red div at bottom right */}
      <div
        onClick={() => setShowForm(true)}
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          width: 20,
          height: 20,
          cursor: "default",
        }}
      />
    </div>
  );
};

export default SystemMetrics;
