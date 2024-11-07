import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

// Registering Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

interface ResumeData {
  _id: string;
  fileName: string;
  atsScore: number;
  submittedAt: string;
}

interface Props {
  resumeData: ResumeData[];
}

const Graph = ({ resumeData }: Props) => {
  // Prepare data for Chart.js
  const chartData = {
    labels: resumeData?.map((item) =>
      new Date(item.submittedAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "ATS Score",
        data: resumeData?.map((item) => item.atsScore),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // This allows the chart to fill the container
    scales: {
      x: {
        type: "category" as const,
        title: {
          display: true,
          text: "Submission Date",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          display: true,
          drawBorder: true,
        },
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "ATS Score",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          display: true,
          drawBorder: true,
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
  };

  return (
    <div className="w-full h-full p-4">
      <Line data={chartData} options={chartOptions} className="w-full h-full" />
    </div>
  );
};

export default Graph;
