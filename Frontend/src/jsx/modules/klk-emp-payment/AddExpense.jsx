import React, { useEffect, useState } from "react";
import { Card, Col } from "react-bootstrap";

const AddExpense = () => {
  const [projects, setProjects] = useState([]);
  const [interventions, setInterventions] = useState([]);

  const [formData, setFormData] = useState({
    project_name: "",
    project_state: "",
    project_district: "",
    project_village: "",
    intervention: "",
    amount: "",
    document: null,
    remarks: "",
  });

  //   FETCH DROPDOWN DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
           `${import.meta.env.VITE_BACKEND_API_URL}expense/add-expense`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();

        console.log("API DATA", data);

        setProjects(data.projects || []);
        setInterventions(data.interventions || []);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  //   HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "document") {
      setFormData({ ...formData, document: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  //   SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      form.append("project_name", formData.project_name);
      form.append("project_state", formData.project_state);
      form.append("project_district", formData.project_district);
      form.append("project_village", formData.project_village);
      form.append("amount", formData.amount);
      form.append("intervention", formData.intervention);
      form.append("remarks", formData.remarks);

      if (formData.document) {
        form.append("document", formData.document);
      }

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}expense/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: form,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Expense Created Successfully");

      // RESET FORM
      setFormData({
        project_name: "",
        project_state: "",
        project_district: "",
        project_village: "",
        intervention: "",
        amount: "",
        document: null,
        remarks: "",
      });

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
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

              {/* Project */}
              <div className="col-lg-6 mb-3">
                <label>Project Name</label>
                <select
                  name="project_name"
                  className="form-control"
                  value={formData.project_name}
                  onChange={handleChange}
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div className="col-lg-6 mb-3">
                <label>State</label>
                <input
                  type="text"
                  name="project_state"
                  className="form-control"
                  value={formData.project_state}
                  onChange={handleChange}
                />
              </div>

              {/* District */}
              <div className="col-lg-6 mb-3">
                <label>District</label>
                <input
                  type="text"
                  name="project_district"
                  className="form-control"
                  value={formData.project_district}
                  onChange={handleChange}
                />
              </div>

              {/* Village */}
              <div className="col-lg-6 mb-3">
                <label>Village</label>
                <input
                  type="text"
                  name="project_village"
                  className="form-control"
                  value={formData.project_village}
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
                  required
                >
                  <option value="">Select Intervention</option>
                  {interventions.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
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