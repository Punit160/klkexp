import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Dropdown, Nav, Tab } from "react-bootstrap";
import { SVGICON } from "../../../constant/theme";

import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import ReactApexChart from "react-apexcharts";
import SkyGreeting from "../../../components/Common/SkyGreeting";
import InvoiceChart, { EarningsChart } from "./UserWidgets";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveStatus(exp) {
  if (exp.payment_status && exp.payment_status > 0) return "Paid";
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

// FY months in Indian financial-year order (Apr → Mar)
const FY_MONTH_ORDER = [
  "Apr", "May", "Jun", "Jul", "Aug", "Sep",
  "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
];

function buildMonthlyChartData(allExpenseData) {
  // initialise every FY month with zeroes
  const monthMap = {};
  FY_MONTH_ORDER.forEach((m) => (monthMap[m] = { total: 0, paid: 0, pending: 0, rejected: 0 }));

  allExpenseData.forEach((exp) => {
    const date = new Date(exp.requested_date || exp.created_at);
    if (isNaN(date)) return;

    // Always English short month so it matches FY_MONTH_ORDER keys
    const month = date.toLocaleString("en-US", { month: "short" });
    if (!monthMap[month]) return;

    const amount = Number(exp.amount || 0);
    monthMap[month].total += amount;

    // ── Accurate status bucketing ──────────────────────────────────────────
    const status = deriveStatus(exp);
    if (status === "Paid") {
      // Use paid_amount if present, else fall back to approved_amount, else full amount
      const paidAmt = Number(exp.paid_amount ?? exp.approved_amount ?? exp.amount ?? 0);
      monthMap[month].paid += paidAmt;
      // Partial payment? Remainder stays pending
      const remaining = amount - paidAmt;
      if (remaining > 0) monthMap[month].pending += remaining;
    } else if (exp.rejection_status || exp.is_rejected) {
      monthMap[month].rejected += amount;
    } else {
      // Approved / Under Review / Pending → not yet paid
      monthMap[month].pending += amount;
    }
  });

  // Trim future months (no data) so chart doesn't show a flat tail
  const activeMonths = FY_MONTH_ORDER.filter((m) => monthMap[m].total > 0);
  const categories = activeMonths.length > 0 ? activeMonths : FY_MONTH_ORDER;

  return {
    categories,
    total: categories.map((m) => monthMap[m].total),
    paid: categories.map((m) => monthMap[m].paid),
    pending: categories.map((m) => monthMap[m].pending),
    rejected: categories.map((m) => monthMap[m].rejected),
  };
}

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
  if (!data?.categories?.length || data.total.every((v) => v === 0)) {
    return <p className="text-center text-muted py-4">No monthly expense data available.</p>;
  }

  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "inherit",
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: [2, 2, 2] },
    colors: ["#6571ff", "#22c55e", "#f59e0b"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.30,
        opacityTo: 0.02,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: data.categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: "12px" } },
    },
    yaxis: {
      labels: {
        formatter: (val) =>
          val >= 100000
            ? `₹${(val / 100000).toFixed(1)}L`
            : val >= 1000
              ? `₹${(val / 1000).toFixed(0)}k`
              : `₹${val}`,
        style: { fontSize: "11px" },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `₹ ${Number(val || 0).toLocaleString("en-IN")}`,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontSize: "13px",
      markers: { width: 10, height: 10, radius: 3 },
    },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 4,
    },
    markers: {
      size: 4,
      strokeWidth: 0,
      hover: { size: 6 },
    },
  };

  const series = [
    { name: "Total Expense", data: data.total },
    { name: "Paid", data: data.paid },
    { name: "Pending", data: data.pending },
  ];

  return (
    <ReactApexChart options={options} series={series} type="area" height={300} />
  );
}

// ─── Project Bar Chart ────────────────────────────────────────────────────────
function ProjectBarChart({ data }) {
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
  // ── Filter State (mirrors AdminDashboard) ──
  const [selectedFY, setSelectedFY] = useState("");          // "" = All Years
  const [selectedProjectId, setSelectedProjectId] = useState(""); // "" = All Projects

  // ── Options populated from first API response ──
  const [availableFYList, setAvailableFYList] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);

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

  // ─────────────────────────────────────────────────────────────────────────────
  // fetchDashboard — accepts fy + projectId, mirrors admin pattern exactly
  //   fy === ""   → send fy_year=0  (all years)
  //   fy === "2024-2025" etc. → send as-is
  //   projectId === "" → omit param (all projects)
  // ─────────────────────────────────────────────────────────────────────────────
  const fetchDashboard = async (fy, projectId) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      // Map empty string → "0" (all years), otherwise send the FY string
      params.set("fy_year", fy === "" ? "0" : fy);
      if (projectId) params.set("project_id", projectId);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}dashboard/user-dashboard?${params}`,
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

        // ── Populate filter dropdowns only on first load ──
        if (availableFYList.length === 0 && d.availableFYList?.length) {
          const list = d.availableFYList
            .map((item) => item.fy_year ?? item)
            .filter(Boolean);
          setAvailableFYList(list);
        }

        if (availableProjects.length === 0 && d.availableProjects?.length) {
          setAvailableProjects(d.availableProjects);
        }

        // ── On very first load, default to the active FY ──
        if (fy === "" && d.activeFY && d.activeFY !== "all") {
          setSelectedFY(d.activeFY);
          // Re-fetch immediately with the active FY so data is correct
          // (avoid infinite loop: only do this when fy was empty/unset)
          fetchDashboard(d.activeFY, projectId);
          return;
        }

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

  // Initial load
  useEffect(() => {
    fetchDashboard("", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch whenever either filter changes
  useEffect(() => {
    fetchDashboard(selectedFY, selectedProjectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFY, selectedProjectId]);

  // ── Derived helpers ──
  const expensesWithStatus = useMemo(
    () => allExpenses.map((e) => ({ ...e, _status: deriveStatus(e) })),
    [allExpenses]
  );

  const countByStatus = (status) =>
    expensesWithStatus.filter((e) => e._status === status).length;

  const monthlyChartData = useMemo(
    () => buildMonthlyChartData(allExpenses),
    [allExpenses]
  );
  const projectChartData = useMemo(
    () => buildProjectChartData(projectWiseData),
    [projectWiseData]
  );

  // ── Filter label (shown in card headers / badges) ──
  const selectedProjectLabel = selectedProjectId
    ? (availableProjects.find(
      (p) => String(p.project_id) === String(selectedProjectId)
    )?.project_name ?? "Project")
    : "All Projects";
  const filterLabel = `${selectedProjectLabel} — FY ${selectedFY || "All"}`;

  // ── Donut chart ──
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

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Page Header ── */}
      <div className="page-head">
        <div className="row align-items-center">

          {/* Left: Greeting */}
          <div className="col-12 col-md-7 mb-3 mb-md-0">
            <SkyGreeting />
          </div>

          {/* Right: Filters + CTA — mirrors admin header exactly */}
          <div className="col-12 col-md-5">
            <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-2 justify-content-md-end">
              <div className="d-flex gap-2 flex-grow-1 flex-md-grow-0">

                {/* Project Filter */}
                <select
                  className="form-select flex-fill"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                >
                  <option value="">All Projects</option>
                  {availableProjects.map((p) => (
                    <option key={p.project_id} value={String(p.project_id)}>
                      {p.project_name}
                    </option>
                  ))}
                </select>

                {/* FY Filter */}
                <select
                  className="form-select flex-fill"
                  value={selectedFY}
                  onChange={(e) => setSelectedFY(e.target.value)}
                >
                  <option value="">All Years</option>
                  {availableFYList
                    .filter((fy) => fy)
                    .map((fy) => (
                      <option key={fy} value={fy}>
                        FY {fy}
                      </option>
                    ))}
                </select>
              </div>

              <Link
                to="/add-expense"
                className="btn btn-primary d-flex justify-content-center align-items-center px-3"
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

      {/* ── ROW 1: Stat Cards ── */}
      <div className="row">

        {/* Card 1: Total Expense */}
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
                  <small className="text-muted">{filterLabel}</small>
                </div>
                <InvoiceChart data={monthlyChartData.total} color="#6571ff" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Paid */}
        <div className="col-xl-3 col-sm-6">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h6 className="mb-0">Paid Amount</h6>
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
                <EarningsChart data={monthlyChartData.paid} color="#22c55e" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Pending */}
        <div className="col-xl-3 col-sm-6">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h6 className="mb-0">Pending Approval</h6>
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
                <EarningsChart data={monthlyChartData.pending} color="#f59e0b" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Rejected */}
        <div className="col-xl-3 col-sm-6">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h6 className="mb-0">Rejected</h6>
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
                <InvoiceChart
                  data={monthlyChartData.rejected ?? []}
                  color="#ef4444"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Monthly Trend + Donut ── */}
      <div className="row">

        {/* Monthly Trend Chart */}
        <div className="col-xl-8">
          <div className="card">
             <div className="card-header border-0 pb-0">
							<h4 className="mb-0">Monthly Expense Trend</h4>
							<span className="badge badge-sm badge-info light ms-2">{filterLabel}</span>
						</div>
            <div className="card-body">
              {loading
                ? <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
                : <MonthlyTrendChart data={monthlyChartData} />
              }
            </div>
          </div>
        </div>

        {/* Donut Breakdown */}
        <div className="col-xl-4">
          <div className="card">
             <div className="card-header border-0 pb-0">
							<h4 className="mb-0">Expense Breakdown</h4>
							<span className="badge badge-sm badge-info light ms-2">{filterLabel}</span>
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
      </div>

      {/* ── ROW 3: Project Wise Bar Chart ── */}
      {projectWiseData.length > 0 && (
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="">
                <div className="card-header border-0 pb-0">
                  <h4 className="mb-0">Project Wise Expense</h4>
                  <span className="badge badge-sm badge-info light ms-2">{filterLabel}</span>
                </div>
              </div>
              <div className="card-body">
                {loading
                  ? <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
                  : <ProjectBarChart data={projectChartData} />
                }
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ── ROW 4: Expense Table with Tabs ── */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h4 className="mb-0">My Expense</h4>
              <span className="badge badge-sm badge-info light ms-2">{filterLabel}</span>
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
                          ) : expensesWithStatus.length === 0 ? (
                            <tr><td colSpan={7} className="text-center text-muted py-4">No expenses found.</td></tr>
                          ) : (
                            expensesWithStatus.map((exp, i) => (
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
                                <td><h6 className="mb-0">{exp.project_name}</h6></td>
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
                                  <span className={exp.payment_status > 0 ? "badge badge-success light border-0" : "badge badge-warning light border-0"}>
                                    {exp.payment_status > 0 ? "Paid" : "Unpaid"}
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
    </>
  );
}

export default UserCommanSection;