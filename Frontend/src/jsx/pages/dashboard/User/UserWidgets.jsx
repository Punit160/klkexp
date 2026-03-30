// UserWidgets.jsx
import ReactApexChart from "react-apexcharts";

function formatINR(amount) {
  return Number(amount || 0).toLocaleString("en-IN");
}

// ─── Invoice Chart (Total Expense / Rejected card) ───────────────────────────
export function InvoiceChart({ data = [], color = "#6571ff" }) {
  const seriesData = data.length > 0 ? data : [0];

  const options = {
    chart: {
      type: "area",
      height: 60,
      sparkline: { enabled: true },
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 },
    },
    colors: [color],
    tooltip: {
      fixed: { enabled: false },
      x: { show: false },
      y: { formatter: (val) => `₹ ${formatINR(val)}` },
      marker: { show: false },
    },
  };

  const series = [{ name: "Amount", data: seriesData }];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={60}
      width={120}
    />
  );
}

// ─── Earnings Chart (Paid / Pending card) ────────────────────────────────────
export function EarningsChart({ data = [], color = "#22c55e" }) {
  const seriesData = data.length > 0 ? data : [0];

  const options = {
    chart: {
      type: "bar",
      height: 60,
      sparkline: { enabled: true },
      toolbar: { show: false },
    },
    plotOptions: {
      bar: { columnWidth: "60%", borderRadius: 2 },
    },
    colors: [color],
    tooltip: {
      fixed: { enabled: false },
      x: { show: false },
      y: { formatter: (val) => `₹ ${formatINR(val)}` },
      marker: { show: false },
    },
  };

  const series = [{ name: "Amount", data: seriesData }];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="bar"
      height={60}
      width={120}
    />
  );
}

export default InvoiceChart;