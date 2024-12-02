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
  ChartOptions,
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

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
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
          color: "rgba(0, 0, 0, 0.1)", // Replace drawBorder with borderColor
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
          color: "rgba(0, 0, 0, 0.1)", // Replace drawBorder with borderColor
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
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
