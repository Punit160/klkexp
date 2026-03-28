import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { SVGICON } from "../../constant/theme";
import { ThemeContext } from "../../../context/ThemeContext";
import fscreen from "fscreen";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


function Header({ onNote }) {

   const navigate = useNavigate();
   const [imgError, setImgError] = useState(false);

   // localStorage se user fetch karo
   const [user, setUser] = useState(() => {
      try {
         const stored = localStorage.getItem("user");
         return stored ? JSON.parse(stored) : null;
      } catch {
         return null;
      }
   });

   // Agar kisi aur jagah se user update ho toh sync karo
   useEffect(() => {
      const handleStorageChange = () => {
         try {
            const stored = localStorage.getItem("user");
            setUser(stored ? JSON.parse(stored) : null);
            setImgError(false);
         } catch {
            setUser(null);
         }
      };
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
   }, []);

   // User ke naam ke initials (photo na ho toh)
   const getInitials = (name) => {
      if (!name) return "SA";
      return name
         .split(" ")
         .map((n) => n[0])
         .join("")
         .toUpperCase()
         .slice(0, 2);
   };

   const userName  = user?.username || user?.name || "Super Admin";
   const userEmail = user?.email || "demo@mail.com";

   //   FIX: BASE_URL properly construct karo — /api/ remove karo
   const BASE = import.meta.env.VITE_BACKEND_API_URL
      .replace(/\/api\/?$/, "")
      .replace(/\/+$/, "");

   const rawImg = user?.user_img || user?.photo || user?.avatar || null;

   //   FIX: Full URL bana rahe hain — sirf /uploads/ nahi, BASE bhi lagao
   const userPhoto = rawImg
      ? rawImg.startsWith("http")
         ? rawImg
         : `${BASE}/uploads/${rawImg}`
      : null;

   // img error reset karo jab user change ho
   useEffect(() => {
      setImgError(false);
   }, [userPhoto]);

   const handleLogout = async () => {
      try {
         const token = localStorage.getItem("token");
         await axios.get(
            `${import.meta.env.VITE_BACKEND_API_URL}login/logout`,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );
      } catch (error) {
         console.error("Logout API error:", error);
      } finally {
         localStorage.removeItem("token");
         localStorage.removeItem("user");
         toast.success("Logged out successfully!", {
            position: "top-right",
            autoClose: 3000,
         });
         setTimeout(() => {
            navigate("/login", { replace: true });
         }, 2000);
      }
   };

   const { background, changeBackground } = useContext(ThemeContext);
   const handleThemeMode = () => {
      if (background.value === "dark") {
         changeBackground({ value: "light", label: "Light" });
      } else {
         changeBackground({ value: "dark", label: "Dark" });
      }
   };
   const handleFullscreenToggle = () => {
      if (!fscreen.fullscreenElement) {
         fscreen.requestFullscreen(document.documentElement).catch(err => {
            console.error("Fullscreen error:", err.message);
         });
      } else {
         fscreen.exitFullscreen();
      }
   };

   // Initials Circle — jab photo nahi hai
   const InitialsCircle = ({ size }) => (
      <div
         style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: "var(--primary)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.38,
            fontWeight: 600,
            flexShrink: 0,
            lineHeight: 1,
            userSelect: "none",
         }}
      >
         {getInitials(userName)}
      </div>
   );

   // Avatar — photo hai toh show karo, error ya null pe initials
   const AvatarImg = ({ size = 20 }) => {
      if (userPhoto && !imgError) {
         return (
            <img
               src={userPhoto}
               width={size}
               height={size}
               alt={userName}
               style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
               onError={() => setImgError(true)}
            />
         );
      }
      return <InitialsCircle size={size} />;
   };

   return (
      <>
         <div className="header">
            <div className="header-content">
               <nav className="navbar navbar-expand">
                  <div className="collapse navbar-collapse justify-content-between">
                     <div className="header-left">
                        <ul className="navbar-nav header-left">
                           <li className="nav-item dropdown notification_dropdown">
                              <button
                                 className={`ic-theme-mode ${background.value === "dark" ? "active" : ""}`}
                                 onClick={handleThemeMode}
                                 type="button"
                              >
                                 <span className="light">Light</span>
                                 <span className="dark">Dark</span>
                              </button>
                           </li>
                        </ul>
                     </div>

                     <ul className="navbar-nav header-right">

                        <li className="nav-item dropdown notification_dropdown">
                           <Link className="nav-link dz-fullscreen" to={"#"} onClick={handleFullscreenToggle}>
                              {SVGICON.fullscreen}
                           </Link>
                        </li>

                        <Dropdown as="li" className="nav-item dropdown notification_dropdown">
                           <Dropdown.Toggle
                              variant=""
                              as="a"
                              className="nav-link bell bell-link i-false c-pointer"
                              onClick={() => onNote()}
                           >
                              {SVGICON.msgbox}
                              <span className="badge text-white bg-secondary">27</span>
                           </Dropdown.Toggle>
                        </Dropdown>

                        {/* Profile dropdown */}
                        <li className="nav-item dropdown header-profile">
                           <Link className="nav-link" to={"#"} role="button" data-bs-toggle="dropdown">
                              <AvatarImg size={32} />
                              <div className="header-info ms-3">
                                 <span className="fs-14 font-w600 mb-0">{userName}</span>
                              </div>
                              {SVGICON.threeline}
                           </Link>

                           {/* Profile Card */}
                           <div className="profile-detail card">
                              <div className="card-body p-0">
                                 <div className="d-flex profile-media justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                       <AvatarImg size={52} />
                                       <div className="ms-3">
                                          <h4 className="mb-0">{userName}</h4>
                                          <p className="mb-0">{userEmail}</p>
                                       </div>
                                    </div>
                                    <Link to="/edit-profile">
                                       <div className="icon-box">{SVGICON.edit}</div>
                                    </Link>
                                 </div>

                                 <div className="media-box">
                                    <ul className="d-flex flex-colunm gap-2 flex-wrap">
                                       <li>
                                          <Link to="/app-profile">
                                             <div className="icon-box-lg">{SVGICON.profile} <p>Profile</p></div>
                                          </Link>
                                       </li>
                                       <li>
                                          <Link to="/message">
                                             <div className="icon-box-lg">{SVGICON.msg} <p>Message</p></div>
                                          </Link>
                                       </li>
                                       <li>
                                          <div
                                             className="icon-box-lg"
                                             onClick={handleLogout}
                                             style={{ cursor: "pointer" }}
                                          >
                                             {SVGICON.logout} <p>Logout</p>
                                          </div>
                                       </li>
                                    </ul>
                                 </div>
                              </div>
                           </div>
                        </li>

                     </ul>
                  </div>
               </nav>
            </div>
         </div>
      </>
   );
}

export default Header;