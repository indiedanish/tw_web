import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format } from 'date-fns';
import { useLocationData } from '../contexts/LocationDataContext';
import { TrendingUp, Activity, MapPin, Clock } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export const Charts = () => {
    const { filteredData, devices, loading } = useLocationData();

    // Speed over time chart data
    const speedChartData = {
        labels: filteredData.map(item =>
            format(new Date(parseInt(item.createdAt)), 'HH:mm:ss')
        ),
        datasets: [
            {
                label: 'Speed (km/h)',
                data: filteredData.map(item => item.speed),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.1,
                fill: true,
            },
        ],
    };

    // Device activity chart data
    const deviceActivityData = {
        labels: devices.map(device => device.name),
        datasets: [
            {
                label: 'Location Records',
                data: devices.map(device => device._count?.locationData || 0),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(16, 185, 129)',
                    'rgb(245, 158, 11)',
                    'rgb(239, 68, 68)',
                    'rgb(139, 92, 246)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Accuracy distribution chart data
    const accuracyData = {
        labels: ['High (0-5m)', 'Medium (5-10m)', 'Low (>10m)'],
        datasets: [
            {
                data: [
                    filteredData.filter(item => item.accuracy <= 5).length,
                    filteredData.filter(item => item.accuracy > 5 && item.accuracy <= 10).length,
                    filteredData.filter(item => item.accuracy > 10).length,
                ],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    'rgb(16, 185, 129)',
                    'rgb(245, 158, 11)',
                    'rgb(239, 68, 68)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
    };

    // Statistics cards data
    const stats = [
  
    ];

    if (filteredData.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-400 mb-4">
                    <TrendingUp className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Data to Display</h3>
                <p className="text-gray-500">No location data available for the selected filters.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center">
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <IconComponent className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Speed Over Time Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-4">
                        <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">Speed Over Time</h3>
                    </div>
                    <div className="h-64">
                        <Line data={speedChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Device Activity Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-4">
                        <Activity className="h-5 w-5 text-green-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">Device Activity</h3>
                    </div>
                    <div className="h-64">
                        <Bar data={deviceActivityData} options={chartOptions} />
                    </div>
                </div>

                {/* Accuracy Distribution Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-4">
                        <MapPin className="h-5 w-5 text-purple-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">Location Accuracy</h3>
                    </div>
                    <div className="h-64">
                        <Doughnut data={accuracyData} options={doughnutOptions} />
                    </div>
                </div>

                {/* Additional Metrics */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-4">
                        <Clock className="h-5 w-5 text-orange-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">Tracking Metrics</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Max Speed</span>
                            <span className="font-semibold text-gray-900">
                                {Math.max(...filteredData.map(item => item.speed))} km/h
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Min Speed</span>
                            <span className="font-semibold text-gray-900">
                                {Math.min(...filteredData.map(item => item.speed))} km/h
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Avg Accuracy</span>
                            <span className="font-semibold text-gray-900">
                                {Math.round(filteredData.reduce((sum, item) => sum + item.accuracy, 0) / filteredData.length || 0)}m
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Altitude Range</span>
                            <span className="font-semibold text-gray-900">
                                {Math.min(...filteredData.map(item => item.altitude))}m - {Math.max(...filteredData.map(item => item.altitude))}m
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 