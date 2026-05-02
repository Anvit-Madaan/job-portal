import { useState } from "react";
import api from "../api";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    try {
      await api.post("/contact", { name, email, message });
      setStatus("Message sent successfully.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send message");
    }
  };

  return (
    <section className="contact-page">
      <div className="contact-card">
        <h1>Contact us</h1>
        {status && <div className="alert success">{status}</div>}
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={handleSubmit} className="contact-form">
          <label>
            Name
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Message
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows="5" />
          </label>
          <button className="primary-button" type="submit">
            Send message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
