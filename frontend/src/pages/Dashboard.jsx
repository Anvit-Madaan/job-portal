import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const fetchFiles = async () => {
    try {
      const { data } = await api.get("/files");
      setFiles(data.files);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load files");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("filePortalToken");
    localStorage.removeItem("token");
    localStorage.removeItem("filePortalUser");
    navigate("/");
  };

  return (
    <section className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>My Files</h1>
          <p>Manage your uploads and share files instantly.</p>
        </div>
        <div className="page-actions">
          <Link to="/upload" className="primary-button">
            Upload file
          </Link>
          <button className="secondary-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}
      <div className="file-grid">
        {files.map((file) => (
          <Link key={file._id} to={`/files/${file._id}`} className="file-card">
            <div className="file-card-title">{file.originalName}</div>
            <div className="file-card-meta">{Math.round(file.size / 1024)} KB</div>
            {file.shareCode ? (
              <div className="file-card-share">
                <span>Share code:</span>
                <strong>{file.shareCode}</strong>
              </div>
            ) : (
              <div className="file-card-share file-card-share-empty">Not shared yet</div>
            )}
          </Link>
        ))}
        {files.length === 0 && <div className="empty-state">No files uploaded yet.</div>}
      </div>
    </section>
  );
};

export default Dashboard;
