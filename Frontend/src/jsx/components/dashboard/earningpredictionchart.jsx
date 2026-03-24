// /* eslint-disable no-dupe-keys */
import ReactApexChart from "react-apexcharts";

const EarningPredictionChart = () => {
    const series = [
        {
            name: "2024 Expenses",
            data: [12, 10, 10, 8, 11, 14, 9, 12, 13, 10, 4, 8], 
        },
        {
            name: "2023 Expenses",
            data: [10, 6, 8, 6, 9, 11, 7, 10, 11, 9, 8, 15], 
        },
       
    ];

    const options = {
        chart: {
            toolbar: { show: false },
            type: "bar",
            fontFamily: "inherit",
            foreColor: "#adb0bb",
            height: 300,
            stacked: true,
            offsetX: -15,
        },
        colors: ["var(--bs-primary)", "#01bd9b"], 
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: "90%",
                columnWidth: "15%",
                borderRadius: [6],
                borderRadiusApplication: "end",
                borderRadiusWhenStacked: "all",
            },
        },
        dataLabels: { enabled: false },
        legend: { show: true, position: "top" }, 
        grid: {
            show: true,
            padding: { top: 0, bottom: 0, right: 0 },
            borderColor: "rgba(0,0,0,0.05)",
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: true } },
        },
        yaxis: {
            min: 0,
            max: 25, 
            tickAmount: 5,
            title: { text: "Expenses (₹ in thousands)" },
        },
        xaxis: {
            axisBorder: { show: false },
            axisTicks: { show: false },
            categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
            labels: { style: { fontSize: "13px", colors: "#adb0bb", fontWeight: "400" } },
        },
        tooltip: {
            theme: "dark",
            y: { formatter: val => `₹${val}k` } 
        },
    };

    return (
        <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
            width="100%"
        />
    );
};

export default EarningPredictionChart;