import { useReducer, useContext, useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { MenuList } from "./Menu";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";
import { Collapse } from "react-bootstrap";

const reducer = (previousState, updatedState) => ({
  ...previousState,
  ...updatedState,
});

const initialState = {
  active: "",
  activeSubmenu: "",
};

function SideBar() {
  const {
    iconHover,
    sidebarposition,
    headerposition,
    sidebarLayout,
    ChangeIconSidebar,
  } = useContext(ThemeContext);

  const [state, setState] = useReducer(reducer, initialState);
  const [hideOnScroll, setHideOnScroll] = useState(true);

  // CLOSE SIDEBAR FUNCTION
  const handleMenuClick = () => {
    let mainwrapper = document.querySelector("#main-wrapper");
    if (mainwrapper && mainwrapper.classList.contains("menu-toggle")) {
      mainwrapper.classList.remove("menu-toggle");
    }
  };

  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y;
      if (isShow !== hideOnScroll) setHideOnScroll(isShow);
    },
    [hideOnScroll]
  );

  const handleMenuActive = (status) => {
    setState({ active: status });
    if (state.active === status) {
      setState({ active: "" });
    }
  };

  const handleSubmenuActive = (status) => {
    setState({ activeSubmenu: status });
    if (state.activeSubmenu === status) {
      setState({ activeSubmenu: "" });
    }
  };

  /// Path
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];

  useEffect(() => {
    MenuList.forEach((data) => {
      data.content?.forEach((item) => {
        if (path === item.to) {
          setState({ active: data.title });
        }
        item.content?.forEach((ele) => {
          if (path === ele.to) {
            setState({
              activeSubmenu: item.title,
              active: data.title,
            });
          }
        });
      });
    });
  }, [path]);

  return (
    <div
      onMouseEnter={() => ChangeIconSidebar(true)}
      onMouseLeave={() => ChangeIconSidebar(false)}
      className={`ic-sidenav ${iconHover} ${sidebarposition.value === "fixed" &&
        sidebarLayout.value === "horizontal" &&
        headerposition.value === "static"
        ? hideOnScroll > 120
          ? "fixed"
          : ""
        : ""
        }`}
    >
      <div className="ic-sidenav-scroll">
        <ul className="metismenu" id="menu">
          {MenuList.map((data, index) => {
            let menuClass = data.classsChange;

            if (menuClass === "menu-title") {
              return (
                <li className={menuClass} key={index}>
                  {data.title}
                </li>
              );
            }

            return (
              <li
                key={index}
                className={`${state.active === data.title ? "mm-active" : ""
                  } ${data.to === path ? "mm-active" : ""}`}
              >
                {data.content && data.content.length > 0 ? (
                  <>
                    {/* MAIN MENU */}
                    <Link
                      to="#"
                      className="has-arrow"
                      onClick={() => handleMenuActive(data.title)}
                    >
                      {data.iconStyle}
                      <span className="nav-text">{data.title}</span>
                    </Link>

                    <Collapse in={state.active === data.title}>
                      <ul
                        className={`${menuClass === "mm-collapse" ? "mm-show" : ""
                          }`}
                      >
                        {data.content.map((sub, i) => (
                          <li
                            key={i}
                            className={`${state.activeSubmenu === sub.title
                              ? "mm-active"
                              : ""
                              }`}
                          >
                            {sub.content && sub.content.length > 0 ? (
                              <>
                                {/* SUBMENU */}
                                <Link
                                  to={sub.to}
                                  className={`${sub.hasMenu ? "has-arrow" : ""} ${sub.to === path ? "mm-active" : ""
                                    }`}
                                  onClick={() => {
                                    handleSubmenuActive(sub.title);
                                    handleMenuClick();
                                  }}
                                >
                                  {sub.title}
                                </Link>

                                <Collapse
                                  in={state.activeSubmenu === sub.title}
                                >
                                  <ul className="mm-show">
                                    {sub.content.map((child, j) => (
                                      <li key={j}>
                                        <Link
                                          to={child.to}
                                          className={`${path === child.to
                                            ? "mm-active"
                                            : ""
                                            }`}
                                          onClick={handleMenuClick}
                                        >
                                          {child.title}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </Collapse>
                              </>
                            ) : (
                              <Link
                                to={sub.to}
                                className={`${sub.to === path ? "mm-active" : ""
                                  }`}
                                onClick={handleMenuClick}
                              >
                                {sub.title}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </Collapse>
                  </>
                ) : (
                  <Link to={data.to} onClick={handleMenuClick}>
                    {data.iconStyle}
                    <span className="nav-text">{data.title}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default SideBar;