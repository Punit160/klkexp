import { useReducer, useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MenuList } from "./Menu";
import { Collapse } from "react-bootstrap";
import { ThemeContext } from "../../../context/ThemeContext";
import { getMyPermissions } from "../../modules/RolePermission/roleApi";


const reducer = (state, newState) => ({ ...state, ...newState });

const initialState = {
  active: "",
  activeSubmenu: "",
};

function SideBar() {
  const { iconHover } = useContext(ThemeContext);

  const [state, setState] = useReducer(reducer, initialState);
  const [menuData, setMenuData] = useState(MenuList);

  // ✅ FETCH PERMISSIONS
  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const res = await getMyPermissions();

      const perms = res?.data?.data || [];
      const permKeys = perms.map((p) => p.key);

      // ✅ FILTER MENU
      const filteredMenu = MenuList.map((menu) => {
        if (!menu.content) return menu;

        const filteredSub = menu.content.filter((sub) => {
          // show if no permission required
          if (!sub.permission) return true;

          return permKeys.includes(sub.permission);
        });

        return { ...menu, content: filteredSub };
      }).filter((menu) => !menu.content || menu.content.length > 0);

      // ✅ FALLBACK (IMPORTANT)
      setMenuData(filteredMenu.length ? filteredMenu : MenuList);

    } catch (error) {
      console.error("Sidebar permission error:", error);

      // fallback if API fails
      setMenuData(MenuList);
    }
  };

  // ACTIVE MENU
  const handleMenuActive = (status) => {
    setState({ active: state.active === status ? "" : status });
  };

  const handleSubmenuActive = (status) => {
    setState({
      activeSubmenu: state.activeSubmenu === status ? "" : status,
    });
  };

  let path = window.location.pathname.split("/").pop();

  return (
    <div className={`ic-sidenav ${iconHover}`}>
      <div className="ic-sidenav-scroll">
        <ul className="metismenu" id="menu">

          {menuData.map((data, index) => {

            if (data.classsChange === "menu-title") {
              return (
                <li className="menu-title" key={index}>
                  {data.title}
                </li>
              );
            }

            return (
              <li
                key={index}
                className={state.active === data.title ? "mm-active" : ""}
              >
                {data.content ? (
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
                      <ul className="mm-show">

                        {data.content.map((sub, i) => (
                          <li key={i}>
                            <Link
                              to={sub.to}
                              className={path === sub.to ? "mm-active" : ""}
                              onClick={() => handleSubmenuActive(sub.title)}
                            >
                              {sub.title}
                            </Link>
                          </li>
                        ))}

                      </ul>
                    </Collapse>
                  </>
                ) : (
                  <Link to={data.to}>
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