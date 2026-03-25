import React, { useState } from "react";
import { Card, Col } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import { useNavigate } from "react-router-dom";
import { createEmployee } from "./employeeApi"; 

const AddEmployee = () => {
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
    status: "1",  //   Default Active
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  //   Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files[0];
      setFormData({ ...formData, photo: file });
      if (file) {
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  //   Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.empName || !formData.empEmail || !formData.password) {
      alert("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("empName", formData.empName);
      data.append("empEmail", formData.empEmail);
      data.append("password", formData.password);
      data.append("reportingHead", formData.reportingHead);
      data.append("doj", formData.doj);
      data.append("dol", formData.dol);
      data.append("ctc", formData.ctc);
      data.append("phone", formData.phone);
      data.append("designation", formData.designation);
      data.append("dob", formData.dob);
      data.append("gender", formData.gender);
      data.append("qualification", formData.qualification);
      data.append("status", formData.status);
      if (formData.photo) {
        data.append("user_img", formData.photo); 
      }

      //  
      const { ok, result } = await createEmployee(data);

      if (ok) {
        alert("Employee added successfully  ");

        setFormData({
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
          status: "1",  //   Default Active
          photo: null,
        });
        setPreview(null);
        navigate("/employee-List");
      } else {
        alert(result.message || "Error occurred ❌");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle activeMenu="Add Employee" motherMenu="Employee" />

      <Col lg={12}>
        <Card>
          <Card.Header>
            <Card.Title>Add Employee</Card.Title>
          </Card.Header>

          <Card.Body>
            <form onSubmit={handleSubmit}>
              <div className="row">

                {/* Employee Name */}
                <div className="col-lg-6 mb-3">
                  <label>Employee Name *</label>
                  <input
                    type="text"
                    name="empName"
                    className="form-control"
                    value={formData.empName}
                    onChange={handleChange}
                    placeholder="Enter employee name"
                  />
                </div>

                {/* Email */}
                <div className="col-lg-6 mb-3">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="empEmail"
                    className="form-control"
                    value={formData.empEmail}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </div>

                {/* Password */}
                <div className="col-lg-6 mb-3">
                  <label>Password *</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                  />
                </div>

                {/* Reporting Head */}
                <div className="col-lg-6 mb-3">
                  <label>Reporting Head</label>
                  <input
                    type="text"
                    name="reportingHead"
                    className="form-control"
                    value={formData.reportingHead}
                    onChange={handleChange}
                    placeholder="Enter reporting head"
                  />
                </div>

                {/* Designation */}
                <div className="col-lg-6 mb-3">
                  <label>Designation</label>
                  <input
                    type="text"
                    name="designation"
                    className="form-control"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Enter designation"
                  />
                </div>

                {/* Phone */}
                <div className="col-lg-6 mb-3">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Date of Birth */}
                <div className="col-lg-6 mb-3">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    className="form-control"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>

                {/* Gender */}
                <div className="col-lg-6 mb-3">
                  <label>Gender</label>
                  <select
                    name="gender"
                    className="form-control"
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
                    name="doj"
                    className="form-control"
                    value={formData.doj}
                    onChange={handleChange}
                  />
                </div>

                {/* Leaving Date */}
                <div className="col-lg-6 mb-3">
                  <label>Leaving Date</label>
                  <input
                    type="date"
                    name="dol"
                    className="form-control"
                    value={formData.dol}
                    onChange={handleChange}
                  />
                </div>

                {/* CTC */}
                <div className="col-lg-6 mb-3">
                  <label>CTC</label>
                  <input
                    type="number"
                    name="ctc"
                    className="form-control"
                    value={formData.ctc}
                    onChange={handleChange}
                    placeholder="Enter CTC"
                  />
                </div>

                {/* Qualification */}
                <div className="col-lg-6 mb-3">
                  <label>Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    className="form-control"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="Enter qualification"
                  />
                </div>

                {/* Status */}
                <div className="col-lg-6 mb-3">
                  <label>Status</label>
                  <select
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="">Select Status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>

                {/* Photo Upload */}
                <div className="col-lg-6 mb-3">
                  <label>Photo</label>
                  <input
                    type="file"
                    name="photo"
                    className="form-control"
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

                {/* Submit Button */}
                <div className="text-end mt-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      loading ||
                      !formData.empName ||
                      !formData.empEmail ||
                      !formData.password
                    }
                  >
                    {loading ? "Saving..." : "Save Employee"}
                  </button>
                </div>

              </div>
            </form>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default AddEmployee;