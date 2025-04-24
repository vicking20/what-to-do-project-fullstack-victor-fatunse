//TaskChart.tsx
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface TaskChartProps {
  statusCount: { Pending: number; InProgress: number; Completed: number };
}

const TaskChart: React.FC<TaskChartProps> = ({ statusCount }) => {
  const barData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Task Count',
        data: [statusCount.Pending, statusCount.InProgress, statusCount.Completed],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [statusCount.Pending, statusCount.InProgress, statusCount.Completed],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Hello 👋, Welcome to your Dashboard</h2>
      <div className='h-7'></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className=" p-0 rounded-lg shadow-md">
          <h3 className="font-semibold mb-2">Tasks by Status (Bar Chart)</h3>
          <Bar data={barData} />
        </div>

        <div className=" p-0 rounded-lg shadow-md">
          <h3 className="font-semibold mb-2">Tasks by Status (Pie Chart)</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default TaskChart;
