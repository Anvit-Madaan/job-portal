import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const ReceiveFile = () => {
  const [code, setCode] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setFile(null);

    if (!code.trim()) {
      setError("Please enter a share code.");
      return;
    }

    try {
      const { data } = await api.get(`/files/shared/${code.trim()}`);
      setFile(data.file);
      setMessage("File loaded successfully. You can download it below.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to retrieve file");
    }
  };

  return (
    <section className="receive-page">
      <div className="receive-card">
        <div className="receive-header">
          <h1>Receive File</h1>
          <Link to="/dashboard" className="secondary-button">
            Send
          </Link>
        </div>
        <p>Enter the 6-digit share code provided by the sender.</p>
        <form onSubmit={handleSubmit} className="receive-form">
          <label>
            Share code
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
          </label>
          <button className="primary-button" type="submit">
            Fetch file
          </button>
        </form>
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}
        {file && (
          <div className="receive-result">
            <h2>{file.originalName}</h2>
            <p>{file.mimeType} • {Math.round(file.size / 1024)} KB</p>
            <a href={file.url} target="_blank" rel="noreferrer" className="primary-button">
              Download file
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReceiveFile;
