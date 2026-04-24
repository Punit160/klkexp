import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";
import logo from "../../../assets/images/logo.png";

export function NavMenuToggle() {
  let mainwrapper = document.querySelector("#main-wrapper");
  if (mainwrapper.classList.contains("menu-toggle")) {
    mainwrapper.classList.remove("menu-toggle");
  } else {
    mainwrapper.classList.add("menu-toggle");
  }
}

function getDashboardRoute() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "/user-dashboard";

    const user = JSON.parse(raw);
    if (!user) return "/user-dashboard";

    const roleId = user?.role_id;

    if (roleId === 1) return "/admin-dashboard";   // SuperAdmin
    if (roleId === 2) return "/manager-dashboard"; // Manager
    if (roleId === 3) return "/user-dashboard";    // User

    return "/user-dashboard"; // fallback

  } catch (error) {
    console.error("getDashboardRoute:", error);
    return "/user-dashboard";
  }
}
const NavHeader = () => {
  const [toggle, setToggle] = useState(false);
  const { openMenuToggle, theme } = useContext(ThemeContext);

  return (
    <div className="nav-header">
      <Link to={getDashboardRoute()} className="brand-logo">
        <div className="logo-wrapper">
          <img src={logo} alt="logo" />
          <div className={`brand-title ${theme === "dark" ? "text-white" : "text-dark"}`}>
            KLK Ventures
          </div>
        </div>
      </Link>

      <div
        className="nav-control"
        onClick={() => {
          setToggle(!toggle);
          openMenuToggle();
          NavMenuToggle();
        }}
      >
        <div className={`hamburger ${toggle ? "is-active" : ""}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </div>
    </div>
  );
};

export default NavHeader;