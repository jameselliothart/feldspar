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
import AvailableColors from '../curve_config/colors.json';

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

export default function PriceChart({ assetDataSets }) {
    const chartDataSets = assetDataSets.map((assetData, idx) => {
        const values = assetData.data.map(dataPoint => {return {x: dataPoint.date, y: dataPoint.value}});
        return {
            label: `${assetData.name} ${assetData.unit}`,
            data: values,
            borderColor: AvailableColors[idx] ?? 'black',
            backgroundColor: AvailableColors[idx] ?? 'black',
        }
    });
    const chartData = {
        datasets: chartDataSets,
    }
    return <Line options={options} data={chartData} />
}