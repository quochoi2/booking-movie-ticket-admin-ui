export const chartsConfig = {
  type: "line",
  height: 250,
  chart: {
    toolbar: {
      show: false,
    },
    background: "#ffffff",
  },
  title: {
    show: "",
  },
  colors: ["#0288d1", "#FF4560"],
  stroke: {
    lineCap: "round",
  },
  markers: {
    size: 5,
  },
  xaxis: {
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    labels: {
      style: {
        colors: "#37474f",
        fontSize: "13px",
        fontFamily: "inherit",
        fontWeight: 300,
      },
    },
  },
  yaxis: {
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    labels: {
      style: {
        colors: "#37474f",
        fontSize: "13px",
        fontFamily: "inherit",
        fontWeight: 300,
      },
    },
  },
  grid: {
    show: true,
    borderColor: "#dddddd",
    strokeDashArray: 5,
    xaxis: {
      lines: {
        show: true,
      },
    },
    padding: {
      top: 5,
      right: 20,
    },
    backgroundColor: "#ffffff",
  },
  fill: {
    opacity: 0.8,
  },
  tooltip: {
    theme: "dark",
  },
};

export default chartsConfig;
