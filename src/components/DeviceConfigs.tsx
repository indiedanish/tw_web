import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Edit2, X } from 'lucide-react';

interface DeviceConfig {
    id: number;
    deviceImei: string;
    gpsTimer: string;
    configTimer: string;
    uploadTimer: string;
    retryCounter: string;
    angleThreshold: string;
    overSpeedingThreshold: string;
    travelStartTimer: string;
    travelStopTimer: string;
    movingTimer: string;
    stopTimer: string;
    distanceThreshold: string;
    heartbeatTimer: string;
    liveStatusUpdateTimer: string;
    baseUrl: string;
    createdAt: string;
    updatedAt: string;
}

interface Device {
    id: number;
    imei: string;
    name: string;
    phoneNo: string;
    emailAddress: string | null;
    createdAt: string;
    updatedAt: string;
    _count: {
        locationData: number;
    };
    config: DeviceConfig | null;
}

interface ConfigFormData {
    gpsTimer: string;
    configTimer: string;
    uploadTimer: string;
    retryCounter: string;
    angleThreshold: string;
    overSpeedingThreshold: string;
    travelStartTimer: string;
    travelStopTimer: string;
    movingTimer: string;
    stopTimer: string;
    distanceThreshold: string;
    heartbeatTimer: string;
    liveStatusUpdateTimer: string;
    baseUrl: string;
}

export const DeviceConfigs: React.FC = () => {
    const navigate = useNavigate();
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [configForm, setConfigForm] = useState<ConfigFormData>({
        gpsTimer: "5",
        configTimer: "60",
        uploadTimer: "10",
        retryCounter: "10",
        angleThreshold: "45",
        overSpeedingThreshold: "60",
        travelStartTimer: "20",
        travelStopTimer: "20",
        movingTimer: "60",
        stopTimer: "130",
        distanceThreshold: "1000",
        heartbeatTimer: "30",
        liveStatusUpdateTimer: "30",
        baseUrl: "https://connectlive.commtw.com:446/twconnectlive/TrackingServices.asmx"
    });
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchDevices = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/devices');
            const result = await response.json();
            if (result.success) {
                setDevices(result.data);
            } else {
                setError('Failed to fetch devices');
            }
        } catch (err) {
            setError('Error fetching devices');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchDevices();
    };

    const handleBack = () => {
        navigate('/');
    };

    const handleEditConfig = (device: Device) => {
        setSelectedDevice(device);
        if (device.config) {
            setConfigForm({
                gpsTimer: device.config.gpsTimer,
                configTimer: device.config.configTimer,
                uploadTimer: device.config.uploadTimer,
                retryCounter: device.config.retryCounter,
                angleThreshold: device.config.angleThreshold,
                overSpeedingThreshold: device.config.overSpeedingThreshold,
                travelStartTimer: device.config.travelStartTimer,
                travelStopTimer: device.config.travelStopTimer,
                movingTimer: device.config.movingTimer,
                stopTimer: device.config.stopTimer,
                distanceThreshold: device.config.distanceThreshold,
                heartbeatTimer: device.config.heartbeatTimer,
                liveStatusUpdateTimer: device.config.liveStatusUpdateTimer,
                baseUrl: device.config.baseUrl
            });
        }
        setIsModalOpen(true);
    };

    const handleUpdateConfig = async () => {
        if (!selectedDevice) return;

        setIsUpdating(true);
        try {
            const response = await fetch(`http://localhost:3000/api/devices/${selectedDevice.imei}/config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(configForm),
            });

            const result = await response.json();
            if (result.success) {
                // Refresh the devices list
                await fetchDevices();
                setIsModalOpen(false);
            } else {
                setError('Failed to update configuration');
            }
        } catch (err) {
            setError('Error updating configuration');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConfigForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 mr-4"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </button>
                            <h1 className="text-2xl font-bold text-gray-800">Device Configurations</h1>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            disabled={isRefreshing}
                        >
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 pt-24 pb-8">
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-md" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMEI</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location Data Count</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Config Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {devices.map((device) => (
                                    <tr key={device.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{device.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{device.imei}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{device.phoneNo}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{device._count.locationData}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${device.config ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {device.config ? 'Configured' : 'Not Configured'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {device.config ? new Date(device.config.updatedAt).toLocaleString() : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEditConfig(device)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Edit2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Configuration Modal */}
            {isModalOpen && selectedDevice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Configure Device: {selectedDevice.name}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(configForm).map(([key, value]) => (
                                    <div key={key} className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </label>
                                        <input
                                            type="text"
                                            name={key}
                                            value={value}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateConfig}
                                    disabled={isUpdating}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isUpdating ? 'Updating...' : 'Update Configuration'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 