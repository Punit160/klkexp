import { useState } from "react";
import { Dropdown, Nav, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SVGICON } from "../../constant/theme";
import InvoiceChart from "../../components/dashboard/invoicechart";
import EarningsChart from "../../components/dashboard/earningschart";
import {
  BsCurrencyDollar,
  BsClockHistory,
  BsCheckCircle,
  BsXCircle,
  BsReceipt,
} from "react-icons/bs";
import EarningPredictionChart from "../../components/dashboard/earningpredictionchart";

// ─── Dummy Data (replace with API) ───────────────────────────────────────────
const allExpenses = {
  "2025-26": [
    { id: 1, title: "Team Lunch", category: "Food", amount: 1500, date: "15 Mar 2026", status: "Approved", project: "Solar Panel Installation", description: "Lunch with client" },
    { id: 2, title: "Cab to Client", category: "Travel", amount: 3200, date: "18 Mar 2026", status: "Pending", project: "Wind Turbine Setup", description: "Cab fare" },
    { id: 3, title: "Office Supplies", category: "Stationery", amount: 850, date: "20 Mar 2026", status: "Rejected", project: "Battery Storage", description: "Notebooks & pens" },
    { id: 4, title: "Software License", category: "Software", amount: 4999, date: "22 Mar 2026", status: "Pending", project: "Solar Panel Installation", description: "Annual subscription" },
    { id: 5, title: "Hotel Stay", category: "Accommodation", amount: 6500, date: "24 Mar 2026", status: "Approved", project: "Wind Turbine Setup", description: "Site visit stay" },
    { id: 6, title: "Medical Kit", category: "Medical", amount: 1200, date: "25 Mar 2026", status: "Approved", project: "Battery Storage", description: "First aid supplies" },
  ],
  "2024-25": [
    { id: 7, title: "Training Materials", category: "Training", amount: 2800, date: "10 Jan 2025", status: "Approved", project: "Solar Panel Installation", description: "Workshop materials" },
    { id: 8, title: "Flight Ticket", category: "Travel", amount: 8500, date: "15 Feb 2025", status: "Approved", project: "Wind Turbine Setup", description: "Delhi site visit" },
    { id: 9, title: "Canteen Bill", category: "Food", amount: 600, date: "20 Mar 2025", status: "Rejected", project: "Battery Storage", description: "Monthly canteen" },
  ],
  "2023-24": [
    { id: 10, title: "Equipment Purchase", category: "Tools", amount: 12000, date: "05 Aug 2023", status: "Approved", project: "Solar Panel Installation", description: "Safety equipment" },
  ],
  "2022-23": [
    { id: 11, title: "Conference Fee", category: "Training", amount: 5000, date: "12 Nov 2022", status: "Approved", project: "Wind Turbine Setup", description: "Annual energy conference" },
  ],
};


const statusBadgeClass = {
  Approved: "badge badge-success light border-0",
  Pending: "badge badge-warning light border-0",
  Rejected: "badge badge-danger light border-0",
};

function computeStats(expenses) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const paid = expenses.filter((e) => e.status === "Approved").reduce((s, e) => s + e.amount, 0);
  const pending = expenses.filter((e) => e.status === "Pending").reduce((s, e) => s + e.amount, 0);
  const rejected = expenses.filter((e) => e.status === "Rejected").reduce((s, e) => s + e.amount, 0);
  return { total, paid, pending, rejected };
}

// ─── Component ────────────────────────────────────────────────────────────────
function UserCommanSection() {
  const [selectedYear, setSelectedYear] = useState("2025-26");
  const [filterStatus, setFilterStatus] = useState("All");
  const [expenses, setExpenses] = useState(allExpenses);
  const [submitMsg, setSubmitMsg] = useState("");


  const yearExpenses = expenses[selectedYear] || [];
  const stats = computeStats(yearExpenses);

  const filtered =
    filterStatus === "All"
      ? yearExpenses
      : yearExpenses.filter((e) => e.status === filterStatus);



  return (
    <>
      {/* ── Page Header ── */}
      <div className="page-head">
        <div className="row align-items-center">
          <div className="col-sm-6 mb-sm-4 mb-3">
            <h3 className="mb-0">My Expense Dashboard</h3>
            <p className="mb-0">Track and raise your expense requests</p>
          </div>
          <div className="col-sm-6 mb-4 text-sm-end">
            <div className="d-inline-flex align-items-center gap-2">
              <select
                className="form-select w-auto"
                value={selectedYear}
                onChange={(e) => { setSelectedYear(e.target.value); setFilterStatus("All"); }}
              >
                <option value="">Select Financial Year</option>
                <option value="2025-26">2025 - 2026</option>
                <option value="2024-25">2024 - 2025</option>
                <option value="2023-24">2023 - 2024</option>
                <option value="2022-23">2022 - 2023</option>
              </select>
              <button
                className="btn btn-primary d-flex align-items-center gap-1"
              >
                <BsReceipt /> + Raise Expense
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Success Alert ── */}
      {submitMsg && (
        <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
          <BsCheckCircle className="me-2" />
          {submitMsg}
          <button type="button" className="btn-close" onClick={() => setSubmitMsg("")} />
        </div>
      )}

      {/* ── Summary Cards ── */}
      <div className="row">

        {/* Total Expense Raised */}
        <div className="col-xl-3 col-sm-6">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h6 className="mb-0">Total Expense Raised</h6>
            </div>
            <div className="card-body pt-2">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="card-title">₹ {stats.total.toLocaleString("en-IN")}</h2>
                  <span>
                    <small className="text-muted me-1">FY {selectedYear}</small>
                  </span>
                </div>
                <div>
                  <InvoiceChart />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Paid / Approved */}
        <div className="col-xl-3 col-sm-6">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h6 className="mb-0">Paid Amount</h6>
              <Dropdown className="dropdown ms-auto c-pointer">
                <Dropdown.Toggle as="div" className="btn-link i-false">{SVGICON.threedot}</Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu dropdown-menu-end" align="end">
                  <Dropdown.Item>View Details</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="card-body pt-2">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="card-title text-success">₹ {stats.paid.toLocaleString("en-IN")}</h2>
                  <span>
                    <small className="text-success font-w600 me-1">
                      {yearExpenses.filter((e) => e.status === "Approved").length} expenses
                    </small>
                    approved
                  </span>
                </div>
                <div>
                  <EarningsChart />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="col-xl-3 col-sm-6">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h6 className="mb-0">Pending Approval</h6>
              <Dropdown className="dropdown ms-auto c-pointer">
                <Dropdown.Toggle as="div" className="btn-link i-false">{SVGICON.threedot}</Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu dropdown-menu-end" align="end">
                  <Dropdown.Item>View Pending</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="card-body pt-2">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="card-title text-warning">₹ {stats.pending.toLocaleString("en-IN")}</h2>
                  <span>
                    <small className="text-warning font-w600 me-1">
                      {yearExpenses.filter((e) => e.status === "Pending").length} expenses
                    </small>
                    awaiting
                  </span>
                </div>
                <div>
                  <EarningsChart />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rejected */}
        <div className="col-xl-3 col-sm-6">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h6 className="mb-0">Rejected</h6>
              <Dropdown className="dropdown ms-auto c-pointer">
                <Dropdown.Toggle as="div" className="btn-link i-false">{SVGICON.threedot}</Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu dropdown-menu-end" align="end">
                  <Dropdown.Item>View Rejected</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="card-body pt-2">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="card-title text-danger">₹ {stats.rejected.toLocaleString("en-IN")}</h2>
                  <span>
                    <small className="text-danger font-w600 me-1">
                      {yearExpenses.filter((e) => e.status === "Rejected").length} expenses
                    </small>
                    rejected
                  </span>
                </div>
                <div>
                  <InvoiceChart />
                </div>
              </div>
            </div>
          </div>
        </div>



      <div className="col-xl-12">
					<div className="card">
						<div className="card-header">
							<h4 className="mb-0">Expense Prediction</h4>
						</div>
						<div className="card-body">
							<div id="EarningsPrediction">

                                <EarningPredictionChart/>
							</div>
						</div>
					</div>
				</div>



        {/* ── Expense Table ── */}
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
              <h4 className="mb-0">
                My Expenses — FY {selectedYear}
              </h4>
              {/* <div className="d-flex gap-2 flex-wrap">
                {["All", "Pending", "Approved", "Rejected"].map((s) => (
                  <button
                    key={s}
                    className={`btn btn-sm ${filterStatus === s ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setFilterStatus(s)}
                  >
                    {s}
                    <span className="ms-1 badge bg-white text-dark">
                      {s === "All"
                        ? yearExpenses.length
                        : yearExpenses.filter((e) => e.status === s).length}
                    </span>
                  </button>
                ))}
              </div> */}
            </div>
            <div className="card-body px-0">
              <Tab.Container defaultActiveKey="table">
                <Nav className="nav nav-pills success-tab">
                  <Nav.Item>
                    <Nav.Link eventKey="table" className="nav-link w-100">
                      {SVGICON.scale} <span>All Expenses</span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="project" className="nav-link w-100">
                      {SVGICON.project} <span>Project Wise</span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="status" className="nav-link w-100">
                      {SVGICON.mobile} <span>Payment Status</span>
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  {/* ALL EXPENSES */}
                  <Tab.Pane eventKey="table">
                    <div className="table-responsive">
                      <table className="table card-table border-no success-tbl">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Project</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center text-muted py-4">
                                No expenses found for this filter.
                              </td>
                            </tr>
                          ) : (
                            filtered.map((exp, i) => (
                              <tr key={exp.id}>
                                <td>{i + 1}</td>
                                <td>
                                  <h6 className="mb-0">{exp.title}</h6>
                                  <span className="fs-13 text-muted">{exp.description}</span>
                                </td>
                                <td>
                                  <span className="badge bg-light text-dark border">{exp.category}</span>
                                </td>
                                <td>{exp.project}</td>
                                <td>{exp.date}</td>
                                <td className="fw-bold text-primary">₹ {exp.amount.toLocaleString("en-IN")}</td>
                                <td>
                                  <span className={statusBadgeClass[exp.status]}>{exp.status}</span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Tab.Pane>

                  {/* PROJECT WISE */}
                  <Tab.Pane eventKey="project">
                    <div className="table-responsive">
                      <table className="table card-table border-no success-tbl">
                        <thead>
                          <tr>
                            <th>Project</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {yearExpenses.map((exp) => (
                            <tr key={exp.id}>
                              <td>
                                <div className="ms-2 cat-name">
                                  <h6 className="mb-0">{exp.title}</h6>
                                  <span>{exp.project}</span>
                                </div>
                              </td>
                              <td>{exp.date}</td>
                              <td>
                                <span className={statusBadgeClass[exp.status]}>{exp.status}</span>
                              </td>
                              <td className="fw-bold text-primary">₹ {exp.amount.toLocaleString("en-IN")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Tab.Pane>

                  {/* PAYMENT STATUS */}
                  <Tab.Pane eventKey="status">
                    <div className="table-responsive">
                      <table className="table card-table border-no success-tbl">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Payment Status</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {yearExpenses.map((exp) => (
                            <tr key={exp.id}>
                              <td>
                                <h6 className="mb-0">{exp.title}</h6>
                              </td>
                              <td>{exp.category}</td>
                              <td>{exp.date}</td>
                              <td>
                                <span className={statusBadgeClass[exp.status]}>{exp.status}</span>
                              </td>
                              <td className="fw-bold text-primary">₹ {exp.amount.toLocaleString("en-IN")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </div>
        </div>
      </div>




    
    </>
  );
}

export default UserCommanSection;