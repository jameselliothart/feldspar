import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Asset Visualizer',
        },
    },
};

export default function PriceChart({ data }) {
    const labels = data.data.map(x => x.date);
    const values = data.data.map(x => x.value);
    const chartData = {
        labels,
        datasets: [
            {
                label: `${data.name} ${data.unit}`,
                data: values,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    }
    return <Line options={options} data={chartData} />;
}