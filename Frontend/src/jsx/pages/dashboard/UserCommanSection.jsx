import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Dropdown, Nav, Tab } from "react-bootstrap";
import { SVGICON } from "../../constant/theme";
import InvoiceChart from "../../components/dashboard/invoicechart";
import EarningsChart from "../../components/dashboard/earningschart";

import {
  BsCheckCircle,
  BsXCircle,
  BsArrowClockwise,
} from "react-icons/bs";
import ReactApexChart from "react-apexcharts";
import SkyGreeting from "../../components/Common/SkyGreeting";


// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Derive a display status from raw API boolean fields */
function deriveStatus(exp) {
  if (exp.payment_status) return "Paid";
  if (exp.approval_status) return "Approved";
  if (exp.reviewer_status) return "Under Review";
  return "Pending";
}

const statusBadgeClass = {
  Paid: "badge badge-success light border-0",
  Approved: "badge badge-info light border-0",
  "Under Review": "badge badge-warning light border-0",
  Pending: "badge badge-warning light border-0",
  Rejected: "badge badge-danger light border-0",
};

function formatINR(amount) {
  return Number(amount || 0).toLocaleString("en-IN");
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Build month-wise chart data from AllExpenseData using requested_date */
function buildMonthlyChartData(allExpenseData) {
  const monthOrder = [
    "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
  ];
  const monthMap = {};
  monthOrder.forEach((m) => (monthMap[m] = { total: 0, paid: 0, pending: 0 }));

  allExpenseData.forEach((exp) => {
    const date = new Date(exp.requested_date || exp.created_at);
    if (isNaN(date)) return;
    const month = date.toLocaleString("en-IN", { month: "short" });
    if (!monthMap[month]) return;
    const amount = Number(exp.amount || 0);
    monthMap[month].total += amount;
    if (exp.payment_status) monthMap[month].paid += amount;
    else monthMap[month].pending += amount;
  });

  return {
    categories: monthOrder,
    total: monthOrder.map((m) => monthMap[m].total),
    paid: monthOrder.map((m) => monthMap[m].paid),
    pending: monthOrder.map((m) => monthMap[m].pending),
  };
}

/** Build project-wise bar chart data from projectWiseData — with null safety */
function buildProjectChartData(projectWiseData) {
  return {
    labels: projectWiseData.map((p) => p.project_name ?? "Unknown"),
    totalAmount: projectWiseData.map((p) => Number(p.totalAmount) || 0),
    pendingAmount: projectWiseData.map((p) => Number(p.pendingAmount) || 0),
    paidAmount: projectWiseData.map((p) => Number(p.totalPaid) || 0),
  };
}

// ─── Monthly Area Chart ───────────────────────────────────────────────────────
function MonthlyTrendChart({ data }) {
  // Guard: don't render if categories are missing
  if (!data?.categories?.length) {
    return <p className="text-center text-muted py-4">No monthly data available.</p>;
  }

  const options = {
    chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    colors: ["#6571ff", "#22c55e", "#f59e0b"],
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05 },
    },
    xaxis: { categories: data.categories },
    yaxis: { labels: { formatter: (val) => `₹${(val / 1000).toFixed(0)}k` } },
    tooltip: { y: { formatter: (val) => `₹ ${formatINR(val)}` } },
    legend: { position: "top" },
    grid: { borderColor: "#f1f1f1" },
  };

  const series = [
    { name: "Total", data: data.total },
    { name: "Paid", data: data.paid },
    { name: "Pending", data: data.pending },
  ];

  return (
    <ReactApexChart options={options} series={series} type="area" height={300} />
  );
}

// ─── Project Bar Chart ────────────────────────────────────────────────────────
function ProjectBarChart({ data }) {
  // Guard: don't render if labels are missing or empty
  if (!data?.labels?.length) {
    return <p className="text-center text-muted py-4">No project data available.</p>;
  }

  const options = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: "50%", borderRadius: 4 } },
    dataLabels: { enabled: false },
    colors: ["#6571ff", "#22c55e", "#f59e0b"],
    xaxis: { categories: data.labels },
    yaxis: { labels: { formatter: (val) => `₹${(val / 1000).toFixed(0)}k` } },
    tooltip: { y: { formatter: (val) => `₹ ${formatINR(val)}` } },
    legend: { position: "top" },
    grid: { borderColor: "#f1f1f1" },
  };

  const series = [
    { name: "Total Amount", data: data.totalAmount },
    { name: "Paid", data: data.paidAmount },
    { name: "Pending", data: data.pendingAmount },
  ];

  return (
    <ReactApexChart options={options} series={series} type="bar" height={300} />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function UserCommanSection() {
  const [selectedYear, setSelectedYear] = useState("2025-26");
  const [filterStatus, setFilterStatus] = useState("All");
  const [submitMsg, setSubmitMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalExpense: 0,
    paidAmount: 0,
    pendingAmount: 0,
    rejectedAmount: 0,
    approvedAmount: 0,
  });
  const [allExpenses, setAllExpenses] = useState([]);
  const [projectWiseData, setProjectWiseData] = useState([]);

  // ── Fetch Dashboard Data ──
  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}dashboard/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setStats({
          totalExpense: d.totalExpense ?? 0,
          paidAmount: d.paidAmount ?? 0,
          pendingAmount: d.pendingAmount ?? 0,
          rejectedAmount: d.rejectedAmount ?? 0,
          approvedAmount: d.approvedAmount ?? 0,
        });
        setAllExpenses(d.AllExpenseData ?? []);
        setProjectWiseData(d.projectWiseData ?? []);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [selectedYear]);

  // ── Derived: attach _status to each expense ──
  const expensesWithStatus = useMemo(
    () => allExpenses.map((e) => ({ ...e, _status: deriveStatus(e) })),
    [allExpenses]
  );

  // ── Filtered table rows ──
  const filtered =
    filterStatus === "All"
      ? expensesWithStatus
      : expensesWithStatus.filter((e) => e._status === filterStatus);

  const countByStatus = (status) =>
    expensesWithStatus.filter((e) => e._status === status).length;

  // ── Chart data ──
  const monthlyChartData = useMemo(
    () => buildMonthlyChartData(allExpenses),
    [allExpenses]
  );
  const projectChartData = useMemo(
    () => buildProjectChartData(projectWiseData),
    [projectWiseData]
  );

  // ── Donut chart — coerce all values to numbers, guard against all-zero ──
  const donutSeries = [
    Number(stats.totalExpense) || 0,
    Number(stats.paidAmount) || 0,
    Number(stats.pendingAmount) || 0,
    Number(stats.rejectedAmount) || 0,
    Number(stats.approvedAmount) || 0,
  ];
  const hasDonutData = donutSeries.some((v) => v > 0);

  const donutOptions = {
    chart: { type: "donut" },
    labels: ["Total", "Paid", "Pending", "Rejected", "Approved"],
    colors: ["#6571ff", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"],
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
    tooltip: { y: { formatter: (val) => `₹ ${formatINR(val)}` } },
  };

  return (
    <>
      {/* ── Page Header ── */}
      <div className="page-head">
        <div className="row align-items-center">

          {/* Bigger column */}
          <div className="col-sm-8 mb-sm-4 mb-3">
            <SkyGreeting />
          </div>

          {/* Smaller column */}
          <div className="col-sm-4 mb-4 text-sm-end">
            <div className="d-inline-flex align-items-center gap-2">
              <select
                className="form-select w-auto"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setFilterStatus("All");
                }}
              >
                <option value="">Select Financial Year</option>
                <option value="2025-26">2025 - 2026</option>
                <option value="2024-25">2024 - 2025</option>
                <option value="2023-24">2023 - 2024</option>
                <option value="2022-23">2022 - 2023</option>
              </select>



              <Link
                to="/add-expense"
                className="btn btn-primary d-flex align-items-center gap-1"
              >
                + Raise Expense
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ── Alerts ── */}
      {submitMsg && (
        <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
          <BsCheckCircle className="me-2" /> {submitMsg}
          <button type="button" className="btn-close" onClick={() => setSubmitMsg("")} />
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
          <BsXCircle className="me-2" /> {error}
          <button type="button" className="btn-close" onClick={() => setError("")} />
        </div>
      )}

      <div className="row">

        {/* ── Card 1: Total Expense ── */}
        <div className="col-xl-3 col-sm-6">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h6 className="mb-0">Total Expense Raised</h6>
            </div>
            <div className="card-body pt-2">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  {loading
                    ? <div className="placeholder-glow"><span className="placeholder col-8" style={{ height: 36 }} /></div>
                    : <h2 className="card-title">₹ {formatINR(stats.totalExpense)}</h2>
                  }
                  <small className="text-muted">FY {selectedYear}</small>
                </div>
                <InvoiceChart />
              </div>
            </div>
          </div>
        </div>

        {/* ── Card 2: Paid + Approved sub-info ── */}
        <div className="col-xl-3 col-sm-6">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h6 className="mb-0">Paid Amount</h6>
              <Dropdown className="dropdown ms-auto c-pointer">
                <Dropdown.Toggle as="div" className="btn-link i-false">{SVGICON.threedot}</Dropdown.Toggle>
                <Dropdown.Menu align="end"><Dropdown.Item>View Details</Dropdown.Item></Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="card-body pt-2">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  {loading
                    ? <div className="placeholder-glow"><span className="placeholder col-8" style={{ height: 36 }} /></div>
                    : <h2 className="card-title text-success">₹ {formatINR(stats.paidAmount)}</h2>
                  }
                  <span>
                    <small className="text-success font-w600 me-1">{countByStatus("Paid")} expenses</small>paid
                  </span>
                  <div className="mt-1">
                    <small className="text-muted">
                      Approved: <span className="text-info fw-bold">₹ {formatINR(stats.approvedAmount)}</span>
                    </small>
                  </div>
                </div>
                <EarningsChart />
              </div>
            </div>
          </div>
        </div>

        {/* ── Card 3: Pending ── */}
        <div className="col-xl-3 col-sm-6">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h6 className="mb-0">Pending Approval</h6>
              <Dropdown className="dropdown ms-auto c-pointer">
                <Dropdown.Toggle as="div" className="btn-link i-false">{SVGICON.threedot}</Dropdown.Toggle>
                <Dropdown.Menu align="end"><Dropdown.Item>View Pending</Dropdown.Item></Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="card-body pt-2">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  {loading
                    ? <div className="placeholder-glow"><span className="placeholder col-8" style={{ height: 36 }} /></div>
                    : <h2 className="card-title text-warning">₹ {formatINR(stats.pendingAmount)}</h2>
                  }
                  <span>
                    <small className="text-warning font-w600 me-1">{countByStatus("Pending")} expenses</small>awaiting
                  </span>
                </div>
                <EarningsChart />
              </div>
            </div>
          </div>
        </div>

        {/* ── Card 4: Rejected ── */}
        <div className="col-xl-3 col-sm-6">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h6 className="mb-0">Rejected</h6>
              <Dropdown className="dropdown ms-auto c-pointer">
                <Dropdown.Toggle as="div" className="btn-link i-false">{SVGICON.threedot}</Dropdown.Toggle>
                <Dropdown.Menu align="end"><Dropdown.Item>View Rejected</Dropdown.Item></Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="card-body pt-2">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  {loading
                    ? <div className="placeholder-glow"><span className="placeholder col-8" style={{ height: 36 }} /></div>
                    : <h2 className="card-title text-danger">₹ {formatINR(stats.rejectedAmount)}</h2>
                  }
                  <span>
                    <small className="text-danger font-w600 me-1">{countByStatus("Rejected")} expenses</small>rejected
                  </span>
                </div>
                <InvoiceChart />
              </div>
            </div>
          </div>
        </div>

        {/* ── Monthly Trend Chart (8 col) ── */}
        <div className="col-xl-8">
          <div className="card">
            <div className="card-header">
              <div>
                <h4 className="mb-0">Monthly Expense Trend</h4>
                <small className="text-muted">Based on requested date — FY {selectedYear}</small>
              </div>
            </div>
            <div className="card-body">
              {loading
                ? <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
                : <MonthlyTrendChart data={monthlyChartData} />
              }
            </div>
          </div>
        </div>

        {/* ── Donut Breakdown (4 col) ── */}
        <div className="col-xl-4">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Expense Breakdown</h4>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
              ) : hasDonutData ? (
                <ReactApexChart options={donutOptions} series={donutSeries} type="donut" height={300} />
              ) : (
                <p className="text-center text-muted py-4">No expense data available.</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Project Wise Bar Chart (full width) ── */}
        {projectWiseData.length > 0 && (
          <div className="col-xl-12">
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">Project Wise Expense</h4>
              </div>
              <div className="card-body">
                {loading
                  ? <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
                  : <ProjectBarChart data={projectChartData} />
                }
              </div>
            </div>
          </div>
        )}

        {/* ── Expense Table ── */}
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
              <h4 className="mb-0">My Expenses — FY {selectedYear}</h4>
              {/* Status filter pills */}
              {/* <div className="d-flex gap-2 flex-wrap">
                {["All", "Pending", "Approved", "Paid", "Rejected", "Under Review"].map((s) => (
                  <button
                    key={s}
                    className={`btn btn-sm ${filterStatus === s ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setFilterStatus(s)}
                  >
                    {s}
                    <span className="ms-1 badge bg-white text-dark">
                      {s === "All" ? expensesWithStatus.length : countByStatus(s)}
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

                  {/* ALL EXPENSES TAB */}
                  <Tab.Pane eventKey="table">
                    <div className="table-responsive">
                      <table className="table card-table border-no success-tbl">
                        <thead>
                          <tr>
                            <th>S no</th>
                            <th>Project</th>
                            <th>State / District</th>
                            <th>Requested Date</th>
                            <th>Amount</th>
                            <th>Approved Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr><td colSpan={7} className="text-center py-4">
                              <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
                              Loading expenses...
                            </td></tr>
                          ) : filtered.length === 0 ? (
                            <tr><td colSpan={7} className="text-center text-muted py-4">No expenses found.</td></tr>
                          ) : (
                            filtered.map((exp, i) => (
                              <tr key={exp.id ?? i}>
                                <td>{i + 1}</td>
                                <td>
                                  <h6 className="mb-0">{exp.project_name}</h6>
                                  <span className="fs-13 text-muted">{exp.created_by}</span>
                                </td>
                                <td>
                                  {exp.project_state}
                                  <br />
                                  <small className="text-muted">{exp.project_district}</small>
                                </td>
                                <td>{formatDate(exp.requested_date)}</td>
                                <td className="fw-bold text-primary">₹ {formatINR(exp.amount)}</td>
                                <td className="fw-bold text-success">
                                  {exp.approved_amount != null
                                    ? `₹ ${formatINR(exp.approved_amount)}`
                                    : <span className="text-muted">—</span>}
                                </td>
                                <td>
                                  <span className={statusBadgeClass[exp._status] ?? "badge badge-secondary"}>
                                    {exp._status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Tab.Pane>

                  {/* PROJECT WISE TAB */}
                  <Tab.Pane eventKey="project">
                    <div className="table-responsive">
                      <table className="table card-table border-no success-tbl">
                        <thead>
                          <tr>
                            <th>Project Name</th>
                            <th>Total Amount</th>
                            <th>Paid</th>
                            <th>Pending</th>
                            <th>Rejected</th>
                            <th>Approved</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr><td colSpan={6} className="text-center py-4">
                              <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
                              Loading...
                            </td></tr>
                          ) : projectWiseData.length === 0 ? (
                            <tr><td colSpan={6} className="text-center text-muted py-4">No project data available.</td></tr>
                          ) : (
                            projectWiseData.map((p, i) => (
                              <tr key={i}>
                                <td><h6 className="mb-0">{p.project_name ?? "—"}</h6></td>
                                <td className="fw-bold text-primary">₹ {formatINR(p.totalAmount)}</td>
                                <td className="text-success fw-bold">₹ {formatINR(p.totalPaid)}</td>
                                <td className="text-warning fw-bold">₹ {formatINR(p.pendingAmount)}</td>
                                <td className="text-danger fw-bold">₹ {formatINR(p.rejectedAmount)}</td>
                                <td className="text-info fw-bold">₹ {formatINR(p.approvedAmount)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Tab.Pane>

                  {/* PAYMENT STATUS TAB */}
                  <Tab.Pane eventKey="status">
                    <div className="table-responsive">
                      <table className="table card-table border-no success-tbl">
                        <thead>
                          <tr>
                            <th>Project</th>
                            <th>Requested Date</th>
                            <th>Amount</th>
                            <th>Manager Approval</th>
                            <th>Reviewer</th>
                            <th>Payment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr><td colSpan={6} className="text-center py-4">
                              <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
                              Loading...
                            </td></tr>
                          ) : expensesWithStatus.length === 0 ? (
                            <tr><td colSpan={6} className="text-center text-muted py-4">No payment data available.</td></tr>
                          ) : (
                            expensesWithStatus.map((exp, i) => (
                              <tr key={exp.id ?? i}>
                                <td><h6 className="mb-0">Project #{exp.project_name}</h6></td>
                                <td>{formatDate(exp.requested_date)}</td>
                                <td className="fw-bold text-primary">₹ {formatINR(exp.amount)}</td>
                                <td>
                                  <span className={exp.approval_status ? "badge badge-success light border-0" : "badge badge-warning light border-0"}>
                                    {exp.approval_status ? "Approved" : "Pending"}
                                  </span>
                                </td>
                                <td>
                                  <span className={exp.reviewer_status ? "badge badge-success light border-0" : "badge badge-secondary light border-0"}>
                                    {exp.reviewer_status ? "Reviewed" : "Not Reviewed"}
                                  </span>
                                </td>
                                <td>
                                  <span className={exp.payment_status ? "badge badge-success light border-0" : "badge badge-warning light border-0"}>
                                    {exp.payment_status ? "Paid" : "Unpaid"}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
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

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </>
  );
}

export default UserCommanSection;