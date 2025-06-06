import React from 'react';
import { useLocationData } from '../contexts/LocationDataContext';
import { format, differenceInHours } from 'date-fns';
import {
    MapPin,
    Gauge,
    Target,
    Clock,
    TrendingUp,
    Activity,
    Navigation,
    Zap
} from 'lucide-react';

export const AnalyticsCards = () => {
    const { filteredData, devices } = useLocationData();

    if (filteredData.length === 0) {
        return null;
    }

    // Calculate analytics
    const totalRecords = filteredData.length;
    const avgSpeed = Math.round(filteredData.reduce((sum, item) => sum + item.speed, 0) / filteredData.length);
    const maxSpeed = Math.max(...filteredData.map(item => item.speed));
    const avgAccuracy = Math.round(filteredData.reduce((sum, item) => sum + item.accuracy, 0) / filteredData.length);

    // Time range analysis
    const timestamps = filteredData.map(item => parseInt(item.time));
    const earliestTime = Math.min(...timestamps);
    const latestTime = Math.max(...timestamps);
    const timeSpan = differenceInHours(latestTime, earliestTime);

    // Distance calculation (simplified - straight line distance between first and last points)
    const firstLocation = filteredData[filteredData.length - 1]; // oldest
    const lastLocation = filteredData[0]; // newest
    const distance = calculateDistance(
        firstLocation.latitude,
        firstLocation.longitude,
        lastLocation.latitude,
        lastLocation.longitude
    );

    // Active devices count
    const activeDevices = devices.filter(device => device._count && device._count.locationData > 0).length;

    const analyticsData = [
        {
            title: 'Total Locations',
            value: totalRecords.toLocaleString(),
            icon: MapPin,
            color: 'bg-blue-500',
            description: 'Total location records',
        },
        {
            title: 'Average Speed',
            value: `${avgSpeed} km/h`,
            icon: Gauge,
            color: 'bg-green-500',
            description: 'Average speed across all records',
        },
        {
            title: 'Max Speed',
            value: `${maxSpeed} km/h`,
            icon: Zap,
            color: 'bg-red-500',
            description: 'Highest recorded speed',
        },
        {
            title: 'Location Accuracy',
            value: `${avgAccuracy}m`,
            icon: Target,
            color: 'bg-purple-500',
            description: 'Average GPS accuracy',
        },
        {
            title: 'Time Span',
            value: timeSpan > 0 ? `${timeSpan}h` : '<1h',
            icon: Clock,
            color: 'bg-orange-500',
            description: 'Data collection period',
        },
        {
            title: 'Distance Traveled',
            value: `${distance.toFixed(1)} km`,
            icon: Navigation,
            color: 'bg-indigo-500',
            description: 'Approximate travel distance',
        },
        {
            title: 'Active Devices',
            value: activeDevices.toString(),
            icon: Activity,
            color: 'bg-teal-500',
            description: 'Devices with location data',
        },
        {
            title: 'Latest Update',
            value: format(new Date(latestTime), 'HH:mm'),
            icon: TrendingUp,
            color: 'bg-pink-500',
            description: 'Most recent location update',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {analyticsData.map((item, index) => {
                const IconComponent = item.icon;
                return (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${item.color} p-3 rounded-lg`}>
                                    <IconComponent className="h-6 w-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                                    <p className="text-sm font-medium text-gray-600">{item.title}</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                        <div className={`h-1 ${item.color}`}></div>
                    </div>
                );
            })}
        </div>
    );
};

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
} 