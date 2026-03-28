import React, { useEffect, useState } from "react";
import { Col, Card } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { getEmployeeById, updateEmployee, getReportingHeads } from "./employeeApi";

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reportingHeads, setReportingHeads] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    empName: "",
    empEmail: "",
    password: "",
    reportingHead: "",
    doj: "",
    dol: "",
    ctc: "",
    phone: "",
    designation: "",
    dob: "",
    gender: "",
    qualification: "",
    status: "1",
    photo: null,
  });

  // Fetch Reporting Heads
  useEffect(() => {
    const fetchReportingHeads = async () => {
      const { ok, result } = await getReportingHeads();
      if (ok) setReportingHeads(result);
    };
    fetchReportingHeads();
  }, []);

  // Fetch Employee by ID
  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      try {
        const res = await getEmployeeById(id);
        // Handle nested response structure
        const data = res?.data || res?.user || res?.result || res;
        setFormData({
          empName: data.username || data.empName || data.name || "",
          empEmail: data.email || data.empEmail || "",
          password: data.password || "",
          reportingHead: data.reporting_head || data.reportingHead || "",
          doj: data.doj ? data.doj.split("T")[0] : "",
          dol: data.dol ? data.dol.split("T")[0] : "",
          ctc: data.ctc !== undefined ? String(data.ctc) : "",
          phone: data.phone_no || data.phone || "",
          designation: data.designation || "",
          dob: data.dob ? data.dob.split("T")[0] : "",
          gender: data.gender || "",
          qualification: data.qualification || "",
          status: data.status === true || data.status === 1 ? "1" : "0",
          photo: null,
        });

        if (data.user_img) {
          setPreview(
            `${import.meta.env.VITE_BACKEND_API_URL}uploads/${data.user_img}`
          );
        }
      } catch (err) {
        console.error("Fetch Employee Error:", err);
        alert("Failed to fetch employee details");
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, photo: file }));
      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          switch (key) {
            case "photo":
              data.append("user_img", value);
              break;
            case "empName":
              data.append("empName", value);
              break;
            case "empEmail":
              data.append("empEmail", value);
              break;
            case "reportingHead":
              data.append("reportingHead", value);
              break;
            case "phone":
              data.append("phone", value);
              break;
            case "status":
              data.append("status", value);
              break;
            case "ctc":
              data.append("ctc", value);
              break;
            default:
              data.append(key, value);
          }
        }
      });

      const { ok, result } = await updateEmployee(id, data);

      if (ok) {
        alert("Employee updated successfully");
        navigate("/employee-List", { state: { updated: true } });
      } else {
        alert(result.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle activeMenu="Update Employee" motherMenu="Employee" />
      <Col lg={12}>
        <Card>
          <Card.Header>
            <Card.Title>Update Employee</Card.Title>
          </Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit}>
              <div className="row">

                {/* Employee Name */}
                <div className="col-lg-6 mb-3">
                  <label>Employee Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="empName"
                    value={formData.empName}
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
                <div className="col-lg-6 mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="empEmail"
                    value={formData.empEmail}
                    onChange={handleChange}
                  />
                </div>

                {/* Password */}
                <div className="col-lg-6 mb-3">
                  <label>
                    Password <small>(leave blank to keep current)</small>
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                    </button>
                  </div>
                </div>

                {/* Reporting Head Dropdown */}
                <div className="col-lg-6 mb-3">
                  <label>Reporting Head</label>
                  <select
                    className="form-control"
                    name="reportingHead"
                    value={formData.reportingHead}
                    onChange={handleChange}
                  >
                    <option value="">Select Reporting Head</option>
                    {reportingHeads.map((head, index) => (
                      <option key={index} value={head.username}>
                        {head.username} ({head.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Designation */}
                <div className="col-lg-6 mb-3">
                  <label>Designation</label>
                  <select
                    name="designation"
                    className="form-control"
                    value={formData.designation}
                    onChange={handleChange}
                  >
                    <option value="">Select Designation</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Employee">Employee</option>
                    <option value="Reviewer">Reviewer</option>
                  </select>
                </div>

                {/* Phone */}
                <div className="col-lg-6 mb-3">
                  <label>Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Date of Birth */}
                <div className="col-lg-6 mb-3">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>

                {/* Gender */}
                <div className="col-lg-6 mb-3">
                  <label>Gender</label>
                  <select
                    className="form-control"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Joining Date */}
                <div className="col-lg-6 mb-3">
                  <label>Joining Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="doj"
                    value={formData.doj}
                    onChange={handleChange}
                  />
                </div>

                {/* Leaving Date */}
                <div className="col-lg-6 mb-3">
                  <label>Leaving Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dol"
                    value={formData.dol}
                    onChange={handleChange}
                  />
                </div>

                {/* CTC */}
                <div className="col-lg-6 mb-3">
                  <label>CTC</label>
                  <input
                    type="number"
                    className="form-control"
                    name="ctc"
                    value={formData.ctc}
                    onChange={handleChange}
                  />
                </div>

                {/* Qualification */}
                <div className="col-lg-6 mb-3">
                  <label>Qualification</label>
                  <input
                    type="text"
                    className="form-control"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                  />
                </div>

                {/* Status */}
                <div className="col-lg-6 mb-3">
                  <label>Status</label>
                  <select
                    className="form-control"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>

                {/* Photo */}
                <div className="col-lg-6 mb-3">
                  <label>Photo</label>
                  <input
                    type="file"
                    className="form-control"
                    name="photo"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="preview"
                      style={{ width: "100px", marginTop: "10px", borderRadius: "6px" }}
                    />
                  )}
                </div>

              </div>

              <div className="text-end mt-3">
                <button
                  className="btn btn-secondary me-2"
                  type="button"
                  onClick={() => navigate("/employee-List")}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Employee"}
                </button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default UpdateEmployee;