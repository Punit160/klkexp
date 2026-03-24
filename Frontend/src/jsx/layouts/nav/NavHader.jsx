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
const NavHeader = () => {
  const [toggle, setToggle] = useState(false);

  // assuming you have theme = 'light' | 'dark'
  const { openMenuToggle, theme } = useContext(ThemeContext);

  return (
    <div className="nav-header">
      <Link to="/dashboard" className="brand-logo">
        <div className="logo-wrapper">
          <img src={logo} alt="logo" />

          <div
            className={`brand-title ${
              theme === "dark" ? "text-white" : "text-dark"
            }`}
          >
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