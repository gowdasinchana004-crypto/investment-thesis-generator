import React, { useRef, useState } from "react";
import Chart from "chart.js/auto";

function App() {
  const fileInputRef = useRef(null);

  const barRef = useRef(null);
  const radarRef = useRef(null);
  const pieRef = useRef(null);

  const [charts, setCharts] = useState({
    bar: null,
    radar: null,
    pie: null
  });

  const uploadFile = async () => {
    const file = fileInputRef.current.files[0];

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    createCharts(data.scores);
  };

  const createCharts = (scores) => {
    const labels = Object.keys(scores);
    const values = Object.values(scores);

    // Destroy old charts
    if (charts.bar) charts.bar.destroy();
    if (charts.radar) charts.radar.destroy();
    if (charts.pie) charts.pie.destroy();

    // BAR CHART
    const barChart = new Chart(barRef.current, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Scores",
            data: values,
            backgroundColor: "rgba(54,162,235,0.7)"
          }
        ]
      },
      options: { responsive: true }
    });

    // RADAR CHART
    const radarChart = new Chart(radarRef.current, {
      type: "radar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Startup Strength",
            data: values,
            backgroundColor: "rgba(255,99,132,0.3)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 10
          }
        }
      }
    });

    // PIE CHART
    const pieChart = new Chart(pieRef.current, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: [
              "#ff6384",
              "#36a2eb",
              "#ffce56",
              "#4bc0c0",
              "#9966ff",
              "#ff9f40",
              "#8bc34a",
              "#e91e63",
              "#9c27b0"
            ]
          }
        ]
      },
      options: { responsive: true }
    });

    setCharts({ bar: barChart, radar: radarChart, pie: pieChart });
  };

  const downloadReport = () => {
  window.open("http://localhost:5000/report", "_blank");
};

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2>Automated Investment Thesis Generator</h2>

        <input type="file" ref={fileInputRef} />
        <br /><br />

        <button onClick={uploadFile}>Analyze Pitch Deck</button>
        <br /><br />

        <button onClick={downloadReport}>Download Report</button>

        <h3>Bar Chart</h3>
        <canvas ref={barRef} style={styles.canvas}></canvas>

        <h3>Radar Chart</h3>
        <canvas ref={radarRef} style={styles.canvas}></canvas>

        <h3>Pie Chart</h3>
        <canvas ref={pieRef} style={styles.canvas}></canvas>
      </div>
    </div>
  );
}

const styles = {
  body: {
    fontFamily: "Arial",
    background: "#f4f6f9",
    textAlign: "center",
    minHeight: "100vh",
    paddingTop: "40px"
  },
  container: {
    width: "900px",
    margin: "auto",
    background: "white",
    padding: "30px",
    borderRadius: "10px"
  },
  canvas: {
    marginTop: "40px",
    width: "700px",
    height: "400px"
  }
};

export default App;