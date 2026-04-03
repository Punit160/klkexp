import { Fragment, useReducer, useState } from "react";
import { Button, Modal, Tab, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Image from "../../assets/images/user.jpg";

const userData = {
  id: 13,
  company_id: "klk1234",
  user_id: "EMP1774425305789",
  username: "Melissa Dodson",
  email: "zuqifosy@mailinator.com",
  reporting_head: "Eligendi exercitatio",
  doj: "1985-07-04T00:00:00.000Z",
  dol: "1998-01-05T00:00:00.000Z",
  ctc: 74000,
  phone_no: "+1 (151) 187-3403",
  designation: "Magni dolore illum",
  role_id: null,
  dob: "2008-11-16T00:00:00.000Z",
  gender: "Female",
  qualification: "Velit delectus volu",
  user_img: null,
  pfesi: false,
  status: true,
  created_by: "amit.sharma@example.com",
  created_at: "2026-03-25T07:55:05.790Z",
};

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const initialState = false;
const reducer = (state, action) => {
  switch (action.type) {
    case "sendMessage":
      return { ...state, sendMessage: !state.sendMessage };
    case "postModal":
      return { ...state, post: !state.post };
    case "linkModal":
      return { ...state, link: !state.link };
    case "cameraModal":
      return { ...state, camera: !state.camera };
    case "replyModal":
      return { ...state, reply: !state.reply };
    default:
      return state;
  }
};

function Profile() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: "", next: "", confirm: "" });
  const [pwdShow, setPwdShow] = useState({ current: false, next: false, confirm: false });
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState(false);

  const handlePwdChange = (e) => {
    setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });
    setPwdError("");
  };

  const handleSubmitPwd = () => {
    if (!pwdForm.current || !pwdForm.next || !pwdForm.confirm) {
      setPwdError("All fields are required.");
      return;
    }
    if (pwdForm.next !== pwdForm.confirm) {
      setPwdError("New password and confirm password do not match.");
      return;
    }
    if (pwdForm.next.length < 8) {
      setPwdError("Password must be at least 8 characters.");
      return;
    }
    setPwdSuccess(true);
    setTimeout(() => {
      setShowPwdModal(false);
      setPwdForm({ current: "", next: "", confirm: "" });
      setPwdSuccess(false);
    }, 1800);
  };

  return (
    <Fragment>
      <div className="row">
        <div className="col-xl-12 col-xxl-12">
          <Tab.Container defaultActiveKey="Personal">
            <div className="row">
              <div className="col-xl-12">
                <div className="profile card card-body p-0">
                  <div className="profile-head">
                    <div className="photo-content">
                     
                      <div className="cover-photo"></div>
                    </div>

                    <div className="profile-info">
                      <div className="profile-photo">
                        <img
                          src={userData.user_img || Image}
                          className="img-fluid rounded-circle"
                          alt={userData.username}
                        />
                      </div>
                      <div className="profile-details">
                        <div className="profile-name px-3">
                          <h4 className="text-white mb-0 fs-23">{userData.username}</h4>
                          <p className="text-white mb-0">{userData.designation}</p>
                          <span className={`badge ${userData.status ? "badge-success" : "badge-danger"}`}>
                            {userData.status ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="profile-info-3">
                      <div className="row pt-5 mx-0 px-0">
                        {/* LEFT-ALIGNED stats */}
                        <div className="col-xl-6 col-xxl-7 col-lg-7">
                          <div className="social-bx">
                            <div className="d-flex gap-5">
                              <div className="text-start bg-light p-2 rounded">
                                <h4 className="font-w600 counter mb-0">
                                  ₹{(userData.ctc / 1000).toFixed(0)}K
                                </h4>
                                <p className="mb-0 text-dark">CTC</p>
                              </div>
                              <div className="text-start bg-light p-2 rounded">
                                <h4 className="font-w600 counter text-success mb-0">
                                  {formatDate(userData.doj)}
                                </h4>
                                <p className="mb-0 text-dark">Joined</p>
                              </div>
                              <div className="text-start bg-light p-2 rounded">
                                <h4 className="font-w600 counter text-danger mb-0">
                                  {userData.gender}
                                </h4>
                                <p className="mb-0 text-dark">Gender</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Change Password button on right */}
                        <div className="col-xl-6 col-xxl-5 col-lg-5">
                          <div className="float-lg-end float-strat">
                            <button
                              className="btn btn-warning"
                              onClick={() => setShowPwdModal(true)}
                            >
                              <i className="fa fa-lock me-1" />Change Password
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="profile-info-3 d-sm-flex d-block align-items-end">
                      <div className="project">
                        <Nav as="ul" className="nav nav-tabs border-0">
                          <Nav.Item as="li" className="nav-item">
                            <Nav.Link eventKey="Personal" className="nav-link">Personal Information</Nav.Link>
                          </Nav.Item>
                          <Nav.Item as="li" className="nav-item">
                            <Nav.Link eventKey="Employment" className="nav-link">Employment Details</Nav.Link>
                          </Nav.Item>
                          <Nav.Item as="li" className="nav-item">
                            <Nav.Link eventKey="Activity" className="nav-link">Activity</Nav.Link>
                          </Nav.Item>
                        </Nav>
                      </div>
                      <div className="progress-box d-sm-block d-none w-25 ms-auto mb-md-4 mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <p className="mb-0 text-dark">Progress</p>
                          <p className="mb-0 text-dark font-w600">75%</p>
                        </div>
                        <div className="progress">
                          <div
                            className="progress-bar bg-success"
                            style={{ width: "75%", height: "8px", borderRadius: "4px" }}
                            role="progressbar"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="col-xl-12">
                <Tab.Content>

                  {/* Personal Information Tab */}
                  <Tab.Pane eventKey="Personal">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title mb-0">Personal Information</h5>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table  mb-0">
                            <tbody>
                              <tr>
                                <th className="w-25">Full Name</th>
                                <td>{userData.username}</td>
                              </tr>
                              <tr>
                                <th>Email</th>
                                <td>{userData.email}</td>
                              </tr>
                              <tr>
                                <th>Phone</th>
                                <td>{userData.phone_no}</td>
                              </tr>
                              <tr>
                                <th>Gender</th>
                                <td>{userData.gender}</td>
                              </tr>
                              <tr>
                                <th>Date of Birth</th>
                                <td>{formatDate(userData.dob)}</td>
                              </tr>
                              <tr>
                                <th>Qualification</th>
                                <td>{userData.qualification}</td>
                              </tr>
                              <tr>
                                <th>Status</th>
                                <td>
                                  <span className={`badge ${userData.status ? "badge-success" : "badge-danger"}`}>
                                    {userData.status ? "Active" : "Inactive"}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>

                  {/* Employment Details Tab */}
                  <Tab.Pane eventKey="Employment">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title mb-0">Employment Details</h5>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table  mb-0">
                            <tbody>
                              <tr>
                                <th className="w-25">Employee ID</th>
                                <td><code>{userData.user_id}</code></td>
                              </tr>
                              <tr>
                                <th>Company ID</th>
                                <td>{userData.company_id}</td>
                              </tr>
                              <tr>
                                <th>Designation</th>
                                <td>{userData.designation}</td>
                              </tr>
                              <tr>
                                <th>Reporting Head</th>
                                <td>{userData.reporting_head}</td>
                              </tr>
                              <tr>
                                <th>Date of Joining</th>
                                <td>{formatDate(userData.doj)}</td>
                              </tr>
                              <tr>
                                <th>Date of Leaving</th>
                                <td>{formatDate(userData.dol)}</td>
                              </tr>
                              <tr>
                                <th>CTC (Annual)</th>
                                <td className="text-success fw-bold">
                                  ₹{userData.ctc.toLocaleString("en-IN")}
                                </td>
                              </tr>
                              <tr>
                                <th>Role ID</th>
                                <td>{userData.role_id ?? "—"}</td>
                              </tr>
                              <tr>
                                <th>PF / ESI</th>
                                <td>
                                  <span className={`badge ${userData.pfesi ? "badge-success" : "badge-danger"}`}>
                                    {userData.pfesi ? "Enrolled" : "Not Enrolled"}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>

                  {/* Activity Tab */}
                  <Tab.Pane eventKey="Activity">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title mb-0">Activity</h5>
                      </div>
                      <div className="card-body">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            <span>Account Created</span>
                            <span className="text-muted">{formatDate(userData.created_at)}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            <span>Created By</span>
                            <span className="text-muted">{userData.created_by}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            <span>Account Status</span>
                            <span className={`badge ${userData.status ? "badge-success" : "badge-danger"}`}>
                              {userData.status ? "Active" : "Inactive"}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Tab.Pane>

                </Tab.Content>
              </div>
            </div>
          </Tab.Container>
        </div>
      </div>

      {/* Link Modal */}
      <Modal show={state.link} className="modal fade post-input" id="linkModal" onHide={() => dispatch({ type: "linkModal" })} centered>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Social Links</h5>
            <button type="button" className="btn-close" data-dismiss="modal" onClick={() => dispatch({ type: "linkModal" })}></button>
          </div>
          <div className="modal-body">
            <Link className="btn-social me-1 facebook" to="/app-profile"><i className="fab fa-facebook-f" /></Link>
            <Link className="btn-social me-1 google-plus" to="/app-profile"><i className="fab fa-google-plus-g" /></Link>
            <Link className="btn-social me-1 linkedin" to="/app-profile"><i className="fab fa-linkedin-in" /></Link>
            <Link className="btn-social me-1 instagram" to="/app-profile"><i className="fab fa-instagram" /></Link>
            <Link className="btn-social me-1 twitter" to="/app-profile"><i className="fab fa-twitter" /></Link>
            <Link className="btn-social me-1 youtube" to="/app-profile"><i className="fab fa-youtube" /></Link>
            <Link className="btn-social whatsapp" to="/app-profile"><i className="fab fa-whatsapp" /></Link>
          </div>
        </div>
      </Modal>

      {/* Camera Modal */}
      <Modal show={state.camera} className="modal fade" id="cameraModal" onHide={() => dispatch({ type: "cameraModal" })} centered>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Upload Image</h5>
            <button type="button" className="btn-close" data-dismiss="modal" onClick={() => dispatch({ type: "cameraModal" })}></button>
          </div>
          <div className="modal-body">
            <div className="input-group custom_file_input mb-3">
              <span className="input-group-text">Upload</span>
              <div className="form-file">
                <input type="file" className="form-file-input form-control" />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal show={showPwdModal} className="modal fade" id="changePwdModal" onHide={() => setShowPwdModal(false)} centered>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Change Password</h5>
            <Button variant="" type="button" className="close" data-dismiss="modal" onClick={() => setShowPwdModal(false)}>
              <span>×</span>
            </Button>
          </div>
          <div className="modal-body">
            {pwdSuccess && (
              <div className="alert alert-success">✅ Password updated successfully!</div>
            )}
            {pwdError && (
              <div className="alert alert-danger">{pwdError}</div>
            )}
            {[
              { name: "current", label: "Current Password" },
              { name: "next", label: "New Password" },
              { name: "confirm", label: "Confirm New Password" },
            ].map((f) => (
              <div className="mb-3" key={f.name}>
                <label className="form-label">{f.label}</label>
                <div className="input-group">
                  <input
                    type={pwdShow[f.name] ? "text" : "password"}
                    className="form-control bg-transparent"
                    name={f.name}
                    value={pwdForm[f.name]}
                    onChange={handlePwdChange}
                    placeholder="••••••••"
                    autoComplete="off"
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setPwdShow((v) => ({ ...v, [f.name]: !v[f.name] }))}
                  >
                    <i className={`fa ${pwdShow[f.name] ? "fa-eye-slash" : "fa-eye"}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <Button variant="secondary" onClick={() => setShowPwdModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmitPwd}>Update Password</Button>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}

export default Profile;