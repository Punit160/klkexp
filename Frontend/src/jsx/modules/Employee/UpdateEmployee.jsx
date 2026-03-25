import React, { useEffect, useState } from "react";
import { Col, Card } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { getEmployeeById, updateEmployee } from "./employeeApi";

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch employee on mount
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getEmployeeById(id);
        setFormData({
          empName: data.username || "",
          empEmail: data.email || "",
          password: "", // leave blank
          reportingHead: data.reporting_head || "",
          doj: data.doj ? data.doj.split("T")[0] : "",
          dol: data.dol ? data.dol.split("T")[0] : "",
          ctc: data.ctc || "",
          phone: data.phone_no || "",
          designation: data.designation || "",
          dob: data.dob ? data.dob.split("T")[0] : "",
          gender: data.gender || "",
          qualification: data.qualification || "",
        //   status: data.status === 1 ? "1" : "0",
         status: "1",
          photo: null,
        });

        if (data.user_img) {
          setPreview(`${import.meta.env.VITE_BACKEND_API_URL}uploads/${data.user_img}`);
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        alert("Failed to fetch employee");
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
    alert("Update failed ");  
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
                  <label>Employee Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="empName"
                    value={formData.empName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="col-lg-6 mb-3">
                  <label>Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="empEmail"
                    value={formData.empEmail}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="col-lg-6 mb-3">
                  <label>Password <small>(leave blank to keep current)</small></label>
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
                      onClick={() => setShowPassword(prev => !prev)}
                    >
                      <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                    </button>
                  </div>
                </div>

                {/* Reporting Head */}
                <div className="col-lg-6 mb-3">
                  <label>Reporting Head</label>
                  <input
                    type="text"
                    className="form-control"
                    name="reportingHead"
                    value={formData.reportingHead}
                    onChange={handleChange}
                  />
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

                {/* Designation */}
                <div className="col-lg-6 mb-3">
                  <label>Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    name="designation"
                    value={formData.designation}
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
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
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
                  {preview && <img src={preview} alt="preview" style={{ width: "100px", marginTop: "10px" }} />}
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
                <button className="btn btn-primary" type="submit" disabled={loading}>
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