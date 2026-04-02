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

// ── Helpers ──────────────
const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

const formatINRShort = (v) => {
    if (v >= 10000000) return "₹" + Math.round(v / 10000000) + "Cr";
    if (v >= 100000) return "₹" + Math.round(v / 100000) + "L";
    if (v >= 1000) return "₹" + Math.round(v / 1000) + "K";
    return "₹" + v;
};

// ── Current FY helper — defined OUTSIDE component so it's available everywhere ──
const getCurrentFY = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const fyStart = month >= 4 ? year : year - 1;
    return `${fyStart}-${fyStart + 1}`; // e.g. "2026-2027"
};

// ── Shared chart colors ─────────────
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

// ── Avatar colors (cycles per user) ────────────────
const AVATAR_COLORS = [
    "#0073fd", "#00aeef", "#1d9e75", "#ee9742",
    "#e83e8c", "#6f42c1", "#fd7e14", "#20c997",
];

// ── ExpenseOverviewChart ────────────────────
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
            <div style={{ position: "relative", width: "100%", height: 320, padding: "0 12px 12px" }}>
                <Bar data={chartData} options={options} />
            </div>
        </>
    );
};

// ── UserBarChart ─────────────────────
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

// ── PeopleContactCard ─────────────
const PeopleContactCard = ({ user, colorIndex }) => {
    const bg = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
    const initials = user.Name
        ? user.Name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
        : "?";

    return (
        <div className="col-xl-4 col-sm-4 col-6">
            <div
                className="avatar-card text-center border-dashed rounded px-2 py-3"
                style={{ borderColor: bg + "66" }}
            >
                <div
                    className="mx-auto mb-2 d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                        width: 52, height: 52,
                        background: bg + "22",
                        border: `2px solid ${bg}`,
                        fontSize: 18, fontWeight: 700,
                        color: bg, letterSpacing: 1,
                    }}
                >
                    {initials}
                </div>
                <h6 className="mb-0" style={{ fontSize: 13, fontWeight: 600 }}>{user.Name}</h6>
                <span className="fs-12 text-muted d-block" style={{ wordBreak: "break-all" }}>
                    {user.user_email}
                </span>
                {user.user_phone && (
                    <span className="fs-12 text-muted d-block">{user.user_phone}</span>
                )}
                <div className="d-flex justify-content-center gap-1 mt-2 flex-wrap">
                    <span className="badge" style={{ background: "#0073fd22", color: "#0073fd", fontSize: 10 }} title="Total Requests">
                        {user.totalRequests} req
                    </span>
                    <span className="badge" style={{ background: "#1d9e7522", color: "#1d9e75", fontSize: 10 }} title="Total Paid">
                        {formatINRShort(user.totalPaid)} paid
                    </span>
                    {user.pendingAmount > 0 && (
                        <span className="badge" style={{ background: "#ee974222", color: "#ee9742", fontSize: 10 }} title="Pending">
                            {formatINRShort(user.pendingAmount)} pending
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── FY display helper ─────────────
const fyLabel = (fy) =>
    fy && fy !== "0" ? `FY ${fy}` : "All Years";

// ── AdminDashboard ================================================================================
const AdminDashboard = () => {
    const [selectedFY, setSelectedFY] = useState(() => getCurrentFY());
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [dashData, setDashData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isFirstLoad = useRef(true);

    const fetchDashboard = async (fy, projectId) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.set("fy_year", fy || "0");
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
                if (isFirstLoad.current) {
                    isFirstLoad.current = false;
                    const fyList = json.data?.filterOptions?.availableFYList ?? [];
                    const currentFY = getCurrentFY();
                    const currentExists = fyList.some(f => f.fy_year === currentFY);
                    if (!currentExists && fyList.length > 0) {
                        // Current FY has no data yet — fall back to latest available
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

    useEffect(() => {
        fetchDashboard(selectedFY, selectedProjectId);
    }, [selectedFY, selectedProjectId]);

    // ── Derived values ───────────────────────────────────────────────────────
    const totalExpense = dashData?.totalExpense ?? 0;
    const paidAmount = dashData?.paidAmount ?? 0;
    const pendingAmount = dashData?.pendingAmount ?? 0;
    const rejectedAmount = dashData?.rejectedAmount ?? 0;
    const approvedAmount = dashData?.approvedAmount ?? 0;
    const approvalQueueCount = dashData?.approvalQueueCount ?? 0;

    const userWiseSummary = dashData?.userWiseSummary ?? [];
    const projectWiseData = dashData?.projectWiseData ?? [];
    const interventionWiseData = dashData?.interventionWiseData ?? [];
    const availableFYList = dashData?.filterOptions?.availableFYList ?? [];
    const availableProjects = dashData?.filterOptions?.availableProjects ?? [];

    const totalRequests = userWiseSummary.reduce((s, u) => s + u.totalRequests, 0);

    const selectedProjectLabel = selectedProjectId
        ? (availableProjects.find(p => String(p.project_id) === String(selectedProjectId))?.project_name ?? "Project")
        : "All Projects";

    const filterLabel = selectedFY && selectedFY !== "0"
        ? `${selectedProjectLabel} — FY ${selectedFY}`
        : `${selectedProjectLabel} — All Years`;

    // ── Loading / Error ───────────────────────────────────────────────────────
    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
            <div className="text-primary">
                <span>Loading…</span>
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

    // ── Render ──────────────────────
    return (
        <>
            {/* ── Page Header ── */}
            <div className="page-head">
                <div className="row align-items-center">
                    <div className="col-12 col-md-7 mb-3 mb-md-0">
                        <SkyGreeting />
                    </div>
                    <div className="col-12 col-md-5">
                        <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-2 justify-content-md-end">
                            <div className="d-flex gap-2 flex-grow-1 flex-md-grow-0">
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

                                <select
                                    className="form-select flex-fill"
                                    value={selectedFY}
                                    onChange={(e) => setSelectedFY(e.target.value)}
                                >
                                    {availableFYList
                                        .filter((f) => f.fy_year)
                                        .map((f) => (
                                            <option key={f.fy_year} value={f.fy_year}>
                                                FY {f.fy_year}
                                            </option>
                                        ))}
                                    <option value="0">All Years</option>
                                </select>
                            </div>
                            <Link
                                to="/add-expense"
                                className="btn btn-primary d-flex justify-content-center align-items-center px-3"
                            >
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
                            <span><small className="text-muted">{fyLabel(selectedFY)}</small></span>
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
                            <span><small className="text-muted">{fyLabel(selectedFY)}</small></span>
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

            {/* ── ROW 3: EXPENSE OVERVIEW CHART + PEOPLE CONTACT ── */}
            <div className="row">
                <div className="col-xl-8">
                    <div className="card overflow-hidden">
                        <div className="card-header border-0 pb-0 flex-wrap">
                            <div className="blance-media">
                                <h5 className="mb-0">Expense Overview</h5>
                                <h4 className="mb-0 text-dark">
                                    {formatINR(totalExpense)}{" "}
                                    <span className="badge badge-sm badge-success light">
                                        {filterLabel}
                                    </span>
                                </h4>
                            </div>
                        </div>
                        <ExpenseOverviewChart data={projectWiseData} />
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

                <div className="col-xl-4">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h5 className="mb-0">User Expense Summary</h5>
                            <Link to="/payment-list" className="badge badge-info light">
                                view all
                            </Link>
                        </div>
                        <div className="card-body">
                            {userWiseSummary.length === 0 ? (
                                <p className="text-muted text-center py-4">No users found.</p>
                            ) : (
                                <div className="row g-2">
                                    {userWiseSummary.map((user, i) => (
                                        <PeopleContactCard key={user.userid ?? i} user={user} colorIndex={i} />
                                    ))}
                                </div>
                            )}
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
                            <span className="badge badge-primary light">{filterLabel}</span>
                        </div>
                        <div className="card-body pb-2">
                            <div className="table-responsive">
                                <table className="table transaction-tbl ItemsCheckboxSec no-footer mb-0">
                                    <thead className="border-self">
                                        <tr>
                                            <th>S No.</th>
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
                                                <td>{i + 1}</td>
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
                                                <td colSpan={8} className="text-center text-muted py-3">No data available.</td>
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
                            <span className="badge badge-info light">{filterLabel}</span>
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
                            <span className="badge badge-primary light">{filterLabel}</span>
                        </div>
                        <div className="card-body pb-2">
                            <div className="table-responsive">
                                <table className="table transaction-tbl mb-0">
                                    <thead className="border-self">
                                        <tr>
                                            <th>S No.</th>
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
                                                <td>{i + 1}</td>
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
        </>
    );
};

export default AdminDashboard;