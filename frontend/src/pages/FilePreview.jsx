import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const FilePreview = () => {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [shareCode, setShareCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFile = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Fetching file", id);
      const { data } = await api.get(`/files/${id}`);
      setFile(data.file);
      setShareCode(data.file.shareCode || "");
    } catch (err) {
      console.error("File fetch failed", err.response || err);
      setError(err.response?.data?.message || "Unable to load file");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFile();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this file permanently?");
    if (!confirmed) return;

    try {
      await api.delete(`/files/${id}`);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete file");
    }
  };

  const handleShare = async () => {
    try {
      const { data } = await api.post(`/files/${id}/share`);
      setShareCode(data.shareCode);
      setMessage("Share code created successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to share file");
    }
  };

  if (loading) {
    return <div className="page-shell">Loading file...</div>;
  }

  if (!file) {
    return (
      <section className="file-preview-page">
        <div className="preview-card">
          <div className="preview-header">
            <h1>File not found</h1>
            <button className="secondary-button" onClick={() => navigate("/dashboard")}>Back</button>
          </div>
          {error && <div className="alert error">{error}</div>}
        </div>
      </section>
    );
  }

  return (
    <section className="file-preview-page">
      <div className="preview-card">
        <div className="preview-header">
          <h1>{file.originalName}</h1>
          <div className="preview-actions">
            <button className="secondary-button" onClick={() => navigate("/dashboard")}>Back</button>
            <button className="danger-button" onClick={handleDelete}>Delete</button>
          </div>
        </div>
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}
        <div className="preview-meta">
          <span>{file.mimeType}</span>
          <span>{Math.round(file.size / 1024)} KB</span>
        </div>
        <div className="preview-body">
          <a href={file.url} target="_blank" rel="noreferrer" className="link-button">
            Open file
          </a>
          <button className="primary-button" onClick={handleShare}>Create share code</button>
        </div>
        {shareCode && (
          <div className="share-url">
            <label>Share code</label>
            <input type="text" value={shareCode} readOnly />
            <p className="share-help">Send this 6-digit code to someone so they can receive the file.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FilePreview;
