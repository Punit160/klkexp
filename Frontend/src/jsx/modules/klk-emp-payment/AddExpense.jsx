import React, { useState } from "react";
import { Card, Col } from "react-bootstrap";

const AddExpense = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    state: "",
    district: "",
    village: "",
    intervention: "",
    amount: "",
    document: null,
    requestedBy: "",
    remarks: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "document") {
      setFormData({ ...formData, document: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <Col lg={12}>
      <Card>
        <Card.Header>
          <Card.Title>Create Expense</Card.Title>
        </Card.Header>

        <Card.Body>
          <form onSubmit={handleSubmit}>
            <div className="row">

              {/* Project Name */}
              <div className="col-lg-6 mb-3">
                <label>Project Name</label>
                <select
                  name="projectName"
                  className="form-control"
                  value={formData.projectName}
                  onChange={handleChange}
                >
                  <option value="">Select Project</option>
                  <option value="Project A">Project A</option>
                  <option value="Project B">Project B</option>
                </select>
              </div>

              {/* State */}
              <div className="col-lg-6 mb-3">
                <label>State</label>
                <select
                  name="state"
                  className="form-control"
                  value={formData.state}
                  onChange={handleChange}
                >
                  <option value="">Select State</option>
                  <option value="UP">Uttar Pradesh</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>

              {/* District */}
              <div className="col-lg-6 mb-3">
                <label>District</label>
                <input
                  type="text"
                  name="district"
                  className="form-control"
                  value={formData.district}
                  onChange={handleChange}
                />
              </div>

              {/* Village */}
              <div className="col-lg-6 mb-3">
                <label>Village</label>
                <input
                  type="text"
                  name="village"
                  className="form-control"
                  value={formData.village}
                  onChange={handleChange}
                />
              </div>

              {/* Intervention */}
              <div className="col-lg-6 mb-3">
                <label>Intervention</label>
                <select
                  name="intervention"
                  className="form-control"
                  value={formData.intervention}
                  onChange={handleChange}
                >
                  <option value="">Select Intervention</option>
                  <option value="Training">Training</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>

              {/* Amount */}
              <div className="col-lg-6 mb-3">
                <label>Amount</label>
                <input
                  type="number"
                  name="amount"
                  className="form-control"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>

              {/* Document */}
              <div className="col-lg-6 mb-3">
                <label>Upload Document</label>
                <input
                  type="file"
                  name="document"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              {/* Requested By */}
              <div className="col-lg-6 mb-3">
                <label>Requested By</label>
                <input
                  type="text"
                  name="requestedBy"
                  className="form-control"
                  value={formData.requestedBy}
                  onChange={handleChange}
                />
              </div>

            

              {/* Remarks */}
              <div className="col-lg-12 mb-3">
                <label>Remarks</label>
                <textarea
                  name="remarks"
                  className="form-control"
                  rows="3"
                  value={formData.remarks}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Submit */}
              <div className="text-end">
                <button type="submit" className="btn btn-primary">
                  Submit Request
                </button>
              </div>

            </div>
          </form>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default AddExpense;