import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import SkyGreeting from "../../../components/Common/SkyGreeting";

import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

const formatINRShort = (v) => {
    if (v >= 10000000) return "₹" + Math.round(v / 10000000) + "Cr";
    if (v >= 100000) return "₹" + Math.round(v / 100000) + "L";
    if (v >= 1000) return "₹" + Math.round(v / 1000) + "K";
    return "₹" + v;
};

// ── Shared chart colors ───────────────────────────────────────────────────────
const CHART_COLORS = {
    total: "#0073fd",
    approved: "#00aeef",
    paid: "#1d9e75",
    pending: "#ee9742",
};

const CHART_LEGEND = [
    { key: "total", label: "Total Amount" },
    { key: "approved", label: "Approved" },
    { key: "paid", label: "Paid" },
    { key: "pending", label: "Pending" },
];

// ── ExpenseOverviewChart ──────────────────────────────────────────────────────
const ExpenseOverviewChart = ({ data = [] }) => {
    const chartData = {
        labels: data.map((p) => p.project_name),
        datasets: [
            {
                label: "Total Amount",
                data: data.map((p) => p.totalAmount),
                backgroundColor: CHART_COLORS.total,
                borderRadius: 10,
                barPercentage: 0.25,
                categoryPercentage: 0.8,
            },
            {
                label: "Approved",
                data: data.map((p) => p.approvedAmount),
                backgroundColor: CHART_COLORS.approved,
                borderRadius: 10,
                barPercentage: 0.25,
                categoryPercentage: 0.8,
            },
            {
                label: "Paid",
                data: data.map((p) => p.totalPaid),
                backgroundColor: CHART_COLORS.paid,
                borderRadius: 10,
                barPercentage: 0.25,
                categoryPercentage: 0.8,
            },
            {
                label: "Pending",
                data: data.map((p) => p.pendingAmount),
                backgroundColor: CHART_COLORS.pending,
                borderRadius: 10,
                barPercentage: 0.25,
                categoryPercentage: 0.8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) =>
                        "  " + ctx.dataset.label + ": " +
                        new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                        }).format(ctx.raw),
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 12 }, maxRotation: 20, minRotation: 0 },
            },
            y: {
                grid: { color: "rgba(128,128,128,0.1)" },
                ticks: { font: { size: 11 }, callback: (v) => formatINRShort(v) },
            },
        },
    };

    if (data.length === 0) {
        return <p className="text-muted text-center py-4">No project data available.</p>;
    }

    return (
        <>
            {/* Custom Legend */}
            <div className="d-flex flex-wrap gap-3 mb-3 px-3 pt-3">
                {CHART_LEGEND.map((item) => (
                    <span
                        key={item.key}
                        className="d-flex align-items-center gap-1"
                        style={{ fontSize: 12, color: "#888" }}
                    >
                        <span
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: 2,
                                background: CHART_COLORS[item.key],
                                display: "inline-block",
                            }}
                        />
                        {item.label}
                    </span>
                ))}
            </div>
            {/* Chart */}
            <div style={{ position: "relative", width: "100%", height: 320, padding: "0 12px 12px" }}>
                <Bar data={chartData} options={options} />
            </div>
        </>
    );
};

// ── UserBarChart ──────────────────────────────────────────────────────────────
const UserBarChart = ({ data = [] }) => {
    const chartData = {
        labels: data.map((u) => u.Name),
        datasets: [
            {
                label: "Total Amount",
                data: data.map((u) => u.totalAmount),
                backgroundColor: CHART_COLORS.total,
                borderRadius: 10,
                barPercentage: 0.40,
                categoryPercentage: 0.8,
            },
            {
                label: "Approved",
                data: data.map((u) => u.approvedAmount),
                backgroundColor: CHART_COLORS.approved,
                borderRadius: 10,
                barPercentage: 0.40,
                categoryPercentage: 0.8,
            },
            {
                label: "Paid",
                data: data.map((u) => u.totalPaid),
                backgroundColor: CHART_COLORS.paid,
                borderRadius: 10,
                barPercentage: 0.40,
                categoryPercentage: 0.8,
            },
            {
                label: "Pending",
                data: data.map((u) => u.pendingAmount),
                backgroundColor: CHART_COLORS.pending,
                borderRadius: 10,
                barPercentage: 0.40,
                categoryPercentage: 0.8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) =>
                        "  " + ctx.dataset.label + ": " +
                        new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                        }).format(ctx.raw),
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 12 }, maxRotation: 20, minRotation: 0 },
            },
            y: {
                grid: { color: "rgba(128,128,128,0.1)" },
                ticks: { font: { size: 11 }, callback: (v) => formatINRShort(v) },
            },
        },
    };

    return (
        <>
            <div className="d-flex flex-wrap gap-3 mb-3">
                {CHART_LEGEND.map((item) => (
                    <span
                        key={item.key}
                        className="d-flex align-items-center gap-1"
                        style={{ fontSize: 12, color: "#888" }}
                    >
                        <span
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: 2,
                                background: CHART_COLORS[item.key],
                                display: "inline-block",
                            }}
                        />
                        {item.label}
                    </span>
                ))}
            </div>
            <div style={{ position: "relative", width: "100%", height: 380 }}>
                <Bar data={chartData} options={options} />
            </div>
        </>
    );
};

// ── AdminDashboard ─────────────────────────────────────────────────────────────
const AdminDashboard = () => {
    const [selectedFY, setSelectedFY] = useState("");
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [dashData, setDashData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ── isFirstLoad ref: auto-select latest FY only once ─────────────────────
    const isFirstLoad = useRef(true);

    // ── Core fetch: always reads latest state values via params ──────────────
    const fetchDashboard = async (fy, projectId) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (fy) params.set("fy_year", fy);
            if (projectId) params.set("project_id", projectId);

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_API_URL}dashboard/admin-dashboard?${params}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            if (json.success) {
                setDashData(json.data);

                // Auto-select the LATEST (last) FY on very first load only
                if (isFirstLoad.current) {
                    isFirstLoad.current = false;
                    const fyList = json.data?.filterOptions?.availableFYList ?? [];
                    if (!fy && fyList.length > 0) {
                        // Pick the last entry — list is ordered oldest→newest
                        setSelectedFY(fyList[fyList.length - 1].fy_year);
                    }
                }
            } else {
                throw new Error("API returned success: false");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ── Re-fetch whenever FY or project changes ───────────────────────────────
    useEffect(() => {
        fetchDashboard(selectedFY, selectedProjectId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFY, selectedProjectId]);

    // ── Derived values — all come from dashData (filtered by FY + project) ───
    const totalExpense        = dashData?.totalExpense        ?? 0;
    const paidAmount          = dashData?.paidAmount          ?? 0;
    const pendingAmount       = dashData?.pendingAmount       ?? 0;
    const rejectedAmount      = dashData?.rejectedAmount      ?? 0;
    const approvedAmount      = dashData?.approvedAmount      ?? 0;
    const approvalQueueCount  = dashData?.approvalQueueCount  ?? 0;

    const userWiseSummary      = dashData?.userWiseSummary      ?? [];
    const projectWiseData      = dashData?.projectWiseData      ?? [];
    const interventionWiseData = dashData?.interventionWiseData ?? [];
    const availableFYList      = dashData?.filterOptions?.availableFYList  ?? [];
    const availableProjects    = dashData?.filterOptions?.availableProjects ?? [];
    // yearlyPaidData comes from same dashData — updates with every filter change
    const yearlyPaidData       = dashData?.yearlyPaidData ?? [];

    const totalRequests = userWiseSummary.reduce((s, u) => s + u.totalRequests, 0);

    // ── Loading / Error ───────────────────────────────────────────────────────
    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading…</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="alert alert-danger m-4">
            Failed to load dashboard data: <strong>{error}</strong>
            <button
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={() => fetchDashboard(selectedFY, selectedProjectId)}
            >
                Retry
            </button>
        </div>
    );

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <>
            {/* ── Page Header ── */}
            <div className="page-head">
                <div className="row align-items-center">
                    <div className="col-sm-7 mb-sm-4">
                        <SkyGreeting />
                    </div>
                    <div className="col-sm-5 mb-4 text-sm-end">
                        <div className="d-inline-flex align-items-center gap-2">

                            {/* Project filter */}
                            <select
                                className="form-select w-auto"
                                value={selectedProjectId}
                                onChange={(e) => {
                                    setSelectedProjectId(e.target.value);
                                }}
                            >
                                <option value="">All Projects</option>
                                {availableProjects.map((p) => (
                                    <option key={p.project_id} value={String(p.project_id)}>
                                        {p.project_name}
                                    </option>
                                ))}
                            </select>

                            {/* Financial Year filter */}
                            <select
                                className="form-select w-auto"
                                value={selectedFY}
                                onChange={(e) => {
                                    setSelectedFY(e.target.value);
                                }}
                            >
                                <option value="">All Years</option>
                                {availableFYList
                                    .filter((f) => f.fy_year)
                                    .map((f) => (
                                        <option key={f.fy_year} value={f.fy_year}>
                                            FY {f.fy_year}
                                        </option>
                                    ))}
                            </select>

                            <Link to="/add-expense" className="btn btn-primary d-flex align-items-center gap-1">
                                + Expense
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ROW 1: FIRST 4 STAT CARDS ── */}
            <div className="row">

                {/* Total Expense */}
                <div className="col-xl-3 col-sm-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="mb-0">Total Expense</h6>
                        </div>
                        <div className="card-body pt-2">
                            <h2 className="card-title mb-0">{formatINR(totalExpense)}</h2>
                            <span><small className="text-muted">FY {selectedFY || "All"}</small></span>
                            <div className="progress mt-3" style={{ height: "6px" }}>
                                <div className="progress-bar bg-primary" style={{ width: "100%" }}></div>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted">All Expenses</small>
                                <small className="text-muted font-w600">{totalRequests} requests</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Approved Amount */}
                <div className="col-xl-3 col-sm-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="mb-0">Approved Amount</h6>
                        </div>
                        <div className="card-body pt-2">
                            <h2 className="card-title mb-0">{formatINR(approvedAmount)}</h2>
                            <span>
                                <small className="text-info font-w600 me-1">
                                    {totalExpense > 0 ? Math.round((approvedAmount / totalExpense) * 100) : 0}%
                                </small>
                                of total expense
                            </span>
                            <div className="progress mt-3" style={{ height: "6px" }}>
                                <div
                                    className="progress-bar bg-info"
                                    style={{ width: `${totalExpense > 0 ? (approvedAmount / totalExpense) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted">Of Total Expense</small>
                                <small className="text-muted font-w600">{formatINR(approvedAmount)}</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Paid Amount */}
                <div className="col-xl-3 col-sm-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="mb-0">Paid Expenses</h6>
                        </div>
                        <div className="card-body pt-2">
                            <h2 className="card-title mb-0">{formatINR(paidAmount)}</h2>
                            <span>
                                <small className="text-success font-w600 me-1">
                                    {approvedAmount > 0 ? Math.round((paidAmount / approvedAmount) * 100) : 0}%
                                </small>
                                of approved amount
                            </span>
                            <div className="progress mt-3" style={{ height: "6px" }}>
                                <div
                                    className="progress-bar bg-success"
                                    style={{ width: `${approvedAmount > 0 ? (paidAmount / approvedAmount) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted">Of Approved</small>
                                <small className="text-muted font-w600">{formatINR(paidAmount)}</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rejected Amount */}
                <div className="col-xl-3 col-sm-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="mb-0">Rejected Expenses</h6>
                        </div>
                        <div className="card-body pt-2">
                            <h2 className="card-title mb-0">{formatINR(rejectedAmount)}</h2>
                            <span>
                                <small className={`font-w600 me-1 ${rejectedAmount > 0 ? "text-danger" : "text-success"}`}>
                                    {totalExpense > 0 ? Math.round((rejectedAmount / totalExpense) * 100) : 0}%
                                </small>
                                of total expense
                            </span>
                            <div className="progress mt-3" style={{ height: "6px" }}>
                                <div
                                    className="progress-bar bg-danger"
                                    style={{ width: `${totalExpense > 0 ? (rejectedAmount / totalExpense) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted">Of Total Expense</small>
                                <small className="text-muted font-w600">{formatINR(rejectedAmount)}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ROW 2: SECOND 4 STAT CARDS ── */}
            <div className="row">

                {/* Total Requests */}
                <div className="col-xl-3 col-sm-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="mb-0">Claims Submitted</h6>
                        </div>
                        <div className="card-body pt-2">
                            <h2 className="card-title mb-0">{totalRequests}</h2>
                            <span><small className="text-muted">FY {selectedFY || "All"}</small></span>
                            <div className="progress mt-3" style={{ height: "6px" }}>
                                <div className="progress-bar bg-primary" style={{ width: "100%" }}></div>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted">Total Claims</small>
                                <small className="text-muted font-w600">{totalRequests} requests</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Approval Queue */}
                <div className="col-xl-3 col-sm-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="mb-0">Pending Review</h6>
                        </div>
                        <div className="card-body pt-2">
                            <h2 className="card-title mb-0">{approvalQueueCount}</h2>
                            <span><small className="text-warning font-w600 me-1">Awaiting action</small></span>
                            <div className="progress mt-3" style={{ height: "6px" }}>
                                <div
                                    className="progress-bar bg-warning"
                                    style={{ width: `${totalRequests > 0 ? (approvalQueueCount / totalRequests) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted">Awaiting Action</small>
                                <small className="text-muted font-w600">{approvalQueueCount} open</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pending Amount */}
                <div className="col-xl-3 col-sm-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="mb-0">Pending Amount</h6>
                        </div>
                        <div className="card-body pt-2">
                            <h2 className="card-title mb-0">{formatINR(pendingAmount)}</h2>
                            <span>
                                <small className="text-warning font-w600 me-1">
                                    {totalExpense > 0 ? Math.round((pendingAmount / totalExpense) * 100) : 0}%
                                </small>
                                of total expense
                            </span>
                            <div className="progress mt-3" style={{ height: "6px" }}>
                                <div
                                    className="progress-bar bg-warning"
                                    style={{ width: `${totalExpense > 0 ? (pendingAmount / totalExpense) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted">Unpaid / Unreviewed</small>
                                <small className="text-muted font-w600">{formatINR(pendingAmount)}</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Users */}
                <div className="col-xl-3 col-sm-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="mb-0">Active Users</h6>
                        </div>
                        <div className="card-body pt-2">
                            <h2 className="card-title mb-0">{userWiseSummary.length}</h2>
                            <span><small className="text-info font-w600 me-1">submitting expenses</small></span>
                            <div className="progress mt-3" style={{ height: "6px" }}>
                                <div className="progress-bar bg-info" style={{ width: "100%" }}></div>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted">Total Users</small>
                                <small className="text-muted font-w600">{userWiseSummary.length} active</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ROW 3: EXPENSE OVERVIEW CHART (8) + YEARLY PAID OVERVIEW (4) ── */}
            <div className="row">

                {/* Expense Overview — filtered project-wise bar chart */}
                <div className="col-xl-8">
                    <div className="card overflow-hidden">
                        <div className="card-header border-0 pb-0 flex-wrap">
                            <div className="blance-media">
                                <h5 className="mb-0">Expense Overview</h5>
                                <h4 className="mb-0 text-dark">
                                    {formatINR(totalExpense)}{" "}
                                    <span className="badge badge-sm badge-success light">
                                        {selectedProjectId
                                            ? (availableProjects.find(p => String(p.project_id) === String(selectedProjectId))?.project_name ?? "Project")
                                            : "All Projects"
                                        }{" — "}FY {selectedFY || "All"}
                                    </span>
                                </h4>
                            </div>
                        </div>

                        {/* Chart now always uses filtered projectWiseData */}
                        <ExpenseOverviewChart data={projectWiseData} />

                        {/* Summary footer */}
                        <div className="ttl-project">
                            <div className="pr-data">
                                <h5>{totalRequests}</h5>
                                <span>Total Request</span>
                            </div>
                            <div className="pr-data">
                                <h5 className="text-primary">{approvalQueueCount}</h5>
                                <span>Pending Review</span>
                            </div>
                            <div className="pr-data">
                                <h5>{formatINR(paidAmount)}</h5>
                                <span>Paid Amount</span>
                            </div>
                            <div className="pr-data">
                                <h5 className="text-danger">{formatINR(rejectedAmount)}</h5>
                                <span>Rejected</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Yearly Paid Overview — reactive to FY + project filters */}
                <div className="col-xl-4">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h5 className="mb-0">Yearly Paid Overview</h5>
                            <span className="badge badge-warning light">
                                FY {selectedFY || "All"}
                            </span>
                        </div>
                        <div className="card-body">
                            {yearlyPaidData.length === 0 ? (
                                <p className="text-muted text-center py-3">No yearly data available.</p>
                            ) : (() => {
                                const totalPaidAcrossAll = yearlyPaidData.reduce((s, d) => s + d.totalPaid, 0);
                                const colors = ["bg-primary", "bg-success", "bg-warning", "bg-info", "bg-danger"];
                                return yearlyPaidData.map((item, i) => {
                                    const pct = totalPaidAcrossAll > 0
                                        ? Math.round((item.totalPaid / totalPaidAcrossAll) * 100)
                                        : 0;
                                    return (
                                        <div key={item.fy_year ?? i} className="mb-3">
                                            <div className="d-flex justify-content-between mb-1">
                                                <span className="fs-14 font-w500">FY {item.fy_year}</span>
                                                <span className="fs-14 font-w700">{pct}%</span>
                                            </div>
                                            <div className="progress" style={{ height: "8px" }}>
                                                <div
                                                    className={`progress-bar ${colors[i % colors.length]}`}
                                                    style={{ width: `${pct}%` }}
                                                ></div>
                                            </div>
                                            <div className="d-flex justify-content-between mt-1">
                                                <small className="text-muted">
                                                    {item.totalCount} payment{item.totalCount !== 1 ? "s" : ""}
                                                </small>
                                                <small className="text-muted font-w600">{formatINR(item.totalPaid)}</small>
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ROW 4: PROJECT-WISE TABLE ── */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header flex-wrap">
                            <h5 className="mb-0">Project-wise Expense Summary</h5>
                            <span className="badge badge-primary light">
                                {selectedProjectId
                                    ? (availableProjects.find(p => String(p.project_id) === String(selectedProjectId))?.project_name ?? "Project")
                                    : "All Projects"
                                }{" — "}FY {selectedFY || "All"}
                            </span>
                        </div>
                        <div className="card-body pb-2">
                            <div className="table-responsive">
                                <table className="table transaction-tbl ItemsCheckboxSec no-footer mb-0">
                                    <thead className="border-self">
                                        <tr>
                                            <th>Project</th>
                                            <th>Requests</th>
                                            <th>Total Amount</th>
                                            <th>Approved</th>
                                            <th>Paid</th>
                                            <th>Pending</th>
                                            <th>Rejected</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projectWiseData.map((row, i) => (
                                            <tr key={i}>
                                                <td><span className="font-w600">{row.project_name}</span></td>
                                                <td><span>{row.totalRequests}</span></td>
                                                <td><span className="font-w700">{formatINR(row.totalAmount)}</span></td>
                                                <td><span className="text-info">{formatINR(row.approvedAmount)}</span></td>
                                                <td><span className="text-success">{formatINR(row.totalPaid)}</span></td>
                                                <td><span className="text-warning">{formatINR(row.pendingAmount)}</span></td>
                                                <td><span className="text-danger">{formatINR(row.rejectedAmount)}</span></td>
                                            </tr>
                                        ))}
                                        {projectWiseData.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="text-center text-muted py-3">No data available.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ROW 5: USER-WISE BAR CHART ── */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h5 className="mb-0">User-wise Summary</h5>
                            <span className="badge badge-info light">
                                {selectedProjectId
                                    ? (availableProjects.find(p => String(p.project_id) === String(selectedProjectId))?.project_name ?? "Project")
                                    : "All Projects"
                                }{" — "}FY {selectedFY || "All"}
                            </span>
                        </div>
                        <div className="card-body">
                            {userWiseSummary.length > 0 ? (
                                <UserBarChart data={userWiseSummary} />
                            ) : (
                                <p className="text-muted text-center py-3">No user data available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ROW 6: INTERVENTION-WISE SUMMARY ── */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h5 className="mb-0">Intervention-wise Summary</h5>
                            <span className="badge badge-primary light">
                                {selectedProjectId
                                    ? (availableProjects.find(p => String(p.project_id) === String(selectedProjectId))?.project_name ?? "Project")
                                    : "All Projects"
                                }{" — "}FY {selectedFY || "All"}
                            </span>
                        </div>
                        <div className="card-body pb-2">
                            <div className="table-responsive">
                                <table className="table transaction-tbl mb-0">
                                    <thead className="border-self">
                                        <tr>
                                            <th>Intervention</th>
                                            <th>Requests</th>
                                            <th>Total Amount</th>
                                            <th>Approved</th>
                                            <th>Paid</th>
                                            <th>Pending</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {interventionWiseData.map((row, i) => (
                                            <tr key={i}>
                                                <td>
                                                    <span className="font-w600">
                                                        {row.intervention_name ?? <em className="text-muted">Unassigned</em>}
                                                    </span>
                                                </td>
                                                <td><span>{row.totalRequests}</span></td>
                                                <td><span className="font-w700">{formatINR(row.totalAmount)}</span></td>
                                                <td><span className="text-info">{formatINR(row.approvedAmount)}</span></td>
                                                <td><span className="text-success">{formatINR(row.totalPaid)}</span></td>
                                                <td><span className="text-warning">{formatINR(row.pendingAmount)}</span></td>
                                            </tr>
                                        ))}
                                        {interventionWiseData.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="text-center text-muted py-3">No data available.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;