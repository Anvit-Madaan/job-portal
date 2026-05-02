import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import Contact from "./pages/Contact";
import SharedFile from "./pages/SharedFile";
import ReceiveFile from "./pages/ReceiveFile";
import FilePreview from "./pages/FilePreview";
import useTheme from "./hooks/useTheme";

function App() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`app-shell ${theme}`}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="app-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
              <Route path="/files/:id" element={<ProtectedRoute><FilePreview /></ProtectedRoute>} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/receive" element={<ReceiveFile />} />
              <Route path="/shared/:code" element={<SharedFile />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="site-footer">
        <p>Created by Anvit Madaan</p>
        <p className="footer-tagline">Secure file sharing made simple — upload, share, and collaborate instantly.</p>
      </footer>
    </div>
  );
}

export default App;
