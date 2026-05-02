import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const SharedFile = () => {
  const { code } = useParams();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadShared = async () => {
      try {
        const { data } = await api.get(`/files/shared/${code}`);
        setFile(data.file);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load shared file");
      }
    };

    loadShared();
  }, [code]);

  if (error) return <div className="page-shell"><div className="alert error">{error}</div></div>;
  if (!file) return <div className="page-shell">Loading shared file...</div>;

  return (
    <section className="shared-file-page">
      <div className="shared-card">
        <h1>{file.originalName}</h1>
        <p>Shared file preview</p>
        <div className="preview-meta">
          <span>{file.mimeType}</span>
          <span>{Math.round(file.size / 1024)} KB</span>
        </div>
        <a href={file.url} target="_blank" rel="noreferrer" className="primary-button">
          Download / Open file
        </a>
      </div>
    </section>
  );
};

export default SharedFile;
