import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setError("");
    setProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token") || localStorage.getItem("filePortalToken");
    console.log("Uploading file", file.name, "with token", !!token);

    try {
      setUploading(true);
      setError("");
      setMessage("");

      await api.post("/files/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (event) => {
          if (!event.total) return;
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        },
      });

      setMessage("Upload successful.");
      setUploading(false);
      navigate("/dashboard");
    } catch (err) {
      setUploading(false);
      setProgress(0);
      console.error("Upload error", err.response || err);
      setError(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <section className="upload-page">
      <div className="upload-card">
        <h1>Upload File</h1>
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={handleSubmit} className="upload-form">
          <label className="file-input-label">
            Drag & drop or choose a file
            <input type="file" name="file" onChange={handleFileChange} />
          </label>
          {file && (
            <div className="selected-file-info">
              <strong>Selected file</strong>
              <span>{file.name} • {(file.size / 1024).toFixed(1)} KB</span>
            </div>
          )}
          {uploading && (
            <div className="upload-progress">
              <div className="upload-progress-fill" style={{ width: `${progress}%` }} />
              <span>{progress}% uploaded</span>
            </div>
          )}
          <button type="submit" className="primary-button" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Upload;
