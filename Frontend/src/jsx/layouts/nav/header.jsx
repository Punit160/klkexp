import { useContext } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { SVGICON } from "../../constant/theme";
import avatar1 from '../../../assets/images/user.jpg'
import { ThemeContext } from "../../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import fscreen from "fscreen";


const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};


function Header({ onNote }) {
	const { background, changeBackground } = useContext(ThemeContext);
	const handleThemeMode = () => {
		if (background.value === 'dark') {
			changeBackground({ value: "light", label: "Light" });
		} else {
			changeBackground({ value: "dark", label: "Dark" });
		}
	}
	const handleFullscreenToggle = () => {
		if (!fscreen.fullscreenElement) {
			fscreen.requestFullscreen(document.documentElement).catch(err => {
				console.error(`Error attempting to enable full-screen mode: ${err.message}`);
			});
		} else {
			fscreen.exitFullscreen();
		}
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
										<button className={`ic-theme-mode ${background.value === "dark" ? "active" : ""}`} onClick={() => handleThemeMode()} type="button">
											<span className="light">Light</span>
											<span className="dark">Dark</span>
										</button>
									</li>
								</ul>
							</div>
							<ul className="navbar-nav header-right">
							
								<li className="nav-item dropdown notification_dropdown">
									<Link className="nav-link dz-fullscreen" to={"#"} onClick={handleFullscreenToggle}> {SVGICON.fullscreen} </Link>
								</li>
							
								<Dropdown
									as="li"
									className="nav-item dropdown notification_dropdown "
								>
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
								<li className="nav-item dropdown header-profile">
									<Link className="nav-link" to={"#"} role="button" data-bs-toggle="dropdown">
										<img src={avatar1} width="20" alt="user" />
										<div className="header-info ms-3">
											<span className="fs-14 font-w600 mb-0">Super Admin</span>
										</div>{SVGICON.threeline}
									</Link>
									<div className="profile-detail card">
										<div className="card-body p-0">
											<div className="d-flex profile-media justify-content-between align-items-center">
												<div className="d-flex align-items-center">
													<img src={avatar1} alt="img" />
													<div className="ms-3">
														<h4 className="mb-0">Super Admin </h4>
														<p className="mb-0">demo@mail.com</p>
													</div>
												</div>
												<Link to="/">
													<div className="icon-box"> {SVGICON.edit} </div>
												</Link>
											</div>
											<div className="media-box">
												<ul className="d-flex flex-colunm gap-2 flex-wrap">
													<li>
														<Link to="/">
															<div className="icon-box-lg"> {SVGICON.profile} <p> Profile </p> </div>
														</Link>
													</li>
													<li>
														<Link to="/">
															<div className="icon-box-lg"> {SVGICON.msg} <p>Message</p> </div>
														</Link>
													</li>
																									
												
											
													<li>
														<Link to="/page-login">
															<div className="icon-box-lg"> {SVGICON.logout} <p> Logout </p> </div>
														</Link>
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
};
export default Header;









