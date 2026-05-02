import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Header = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const isAuthRoute = ["/", "/register"].includes(location.pathname);

  return (
    <motion.header
      className="topbar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="brand">
        <Link to="/dashboard">FileShare Portal</Link>
      </div>
      <div className="topbar-actions">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "Light" : "Dark"}
        </button>
        {!isAuthRoute && (
          <>
            <Link className="link-button" to="/receive">
              Receive
            </Link>
            <Link className="link-button" to="/contact">
              Contact
            </Link>
          </>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
