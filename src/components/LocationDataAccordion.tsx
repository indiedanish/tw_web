import React, { useState } from 'react';
import { format } from 'date-fns';
import {
    ChevronDown,
    ChevronUp,
    MapPin,
    Clock,
    Navigation,
    Gauge,
    Activity,
    Smartphone,
    Mail,
    Phone,
    Target,
    Compass,
    Mountain,
    Zap,
    Settings,
    Database,
    Calendar,
    Globe
} from 'lucide-react';
import { useLocationData } from '../contexts/LocationDataContext';
import { LocationData } from '../types';
import { Pagination } from './Pagination';

interface AccordionItemProps {
    location: LocationData;
    isOpen: boolean;
    onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ location, isOpen, onToggle }) => {
    const formatDate = (timestamp: string) => {
        try {
            return format(new Date(parseInt(timestamp)), 'dd/MM/yyyy HH:mm:ss');
        } catch {
            return 'Invalid Date';
        }
    };

    const formatCreatedDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
        } catch {
            return 'Invalid Date';
        }
    };

    const getIgStatusText = (status: number) => {
        return status === 1 ? 'ON' : 'OFF';
    };

    const getIgStatusColor = (status: number) => {
        return status === 1 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
    };

    const locationFields = [
        {
            category: "Device Information",
            icon: Smartphone,
            color: "bg-blue-500",
            fields: [
                { label: "Device Name", value: location.name || 'N/A', icon: Smartphone },
                { label: "IMEI", value: location.imei || 'N/A', icon: Database },
                { label: "Phone Number", value: location.phoneNo || 'N/A', icon: Phone },
                { label: "Email Address", value: location.emailAddress || 'N/A', icon: Mail },
                { label: "Version", value: location.versionNo || 'N/A', icon: Settings },
            ]
        },
        {
            category: "Location Details",
            icon: MapPin,
            color: "bg-green-500",
            fields: [
                { label: "Latitude", value: location.latitude?.toFixed(6) || 'N/A', icon: MapPin },
                { label: "Longitude", value: location.longitude?.toFixed(6) || 'N/A', icon: MapPin },
                { label: "Altitude", value: location.altitude ? `${location.altitude}m` : 'N/A', icon: Mountain },
                { label: "Accuracy", value: location.accuracy ? `${location.accuracy}m` : 'N/A', icon: Target },
                { label: "Provider", value: location.provider || 'N/A', icon: Globe },
            ]
        },
        {
            category: "Movement Data",
            icon: Navigation,
            color: "bg-purple-500",
            fields: [
                { label: "Speed", value: location.speed ? `${location.speed} km/h` : 'N/A', icon: Gauge },
                { label: "Bearing", value: location.bearing ? `${location.bearing}°` : 'N/A', icon: Compass },
                { label: "Reason", value: location.reason || 'N/A', icon: Activity },
                {
                    label: "Ignition Status", value: location.igStatus !== null ? getIgStatusText(location.igStatus) : 'N/A', icon: Zap,
                    valueClass: location.igStatus !== null ? getIgStatusColor(location.igStatus) : ''
                },
            ]
        },
        {
            category: "Timestamps",
            icon: Clock,
            color: "bg-orange-500",
            fields: [
                { label: "Device Time", value: location.deviceRDT || 'N/A', icon: Clock },
                { label: "Server Time", value: location.createdAt ? format(new Date(location.createdAt), 'dd/MM/yyyy HH:mm:ss') : 'N/A', icon: Clock },
                { label: "GMT Settings", value: location.gmtSettings || 'N/A', icon: Globe },
                { label: "Created At", value: location.createdAt ? formatCreatedDate(location.createdAt) : 'N/A', icon: Calendar },
                { label: "Updated At", value: location.updatedAt ? formatCreatedDate(location.updatedAt) : 'N/A', icon: Calendar },
            ]
        },
        {
            category: "System Data",
            icon: Database,
            color: "bg-gray-500",
            fields: [
                { label: "Location ID", value: location.id?.toString() || 'N/A', icon: Database },
                { label: "Device ID", value: location.deviceId?.toString() || 'N/A', icon: Database },
                { label: "Local Primary ID", value: location.localPrimaryId?.toString() || 'N/A', icon: Database },
            ]
        }
    ];

    return (
        <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-4">
            {/* Accordion Header */}
            <div
                className="bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                onClick={onToggle}
            >
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <Activity className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{location.name || 'Unknown Device'}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {location.latitude?.toFixed(6) || 'N/A'}, {location.longitude?.toFixed(6) || 'N/A'}
                                </span>
                                <span className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {location.createdAt ? formatDate(location.createdAt) : 'N/A'}
                                </span>
                                <span className="flex items-center">
                                    <Gauge className="h-4 w-4 mr-1" />
                                    {location.speed || 'N/A'} km/h
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${location.igStatus !== null ? getIgStatusColor(location.igStatus) : 'text-gray-600 bg-gray-100'}`}>
                                    {location.igStatus !== null ? getIgStatusText(location.igStatus) : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">ID: {location.id}</span>
                        {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                    </div>
                </div>
            </div>

            {/* Accordion Content */}
            {isOpen && (
                <div className="bg-gray-50 border-t border-gray-200">
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {locationFields.map((category, categoryIndex) => {
                                const CategoryIcon = category.icon;
                                return (
                                    <div key={categoryIndex} className="bg-white rounded-lg shadow-sm border border-gray-200">
                                        <div className="p-4 border-b border-gray-200">
                                            <div className="flex items-center space-x-2">
                                                <div className={`${category.color} p-2 rounded-lg`}>
                                                    <CategoryIcon className="h-4 w-4 text-white" />
                                                </div>
                                                <h4 className="font-semibold text-gray-800">{category.category}</h4>
                                            </div>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            {category.fields.map((field, fieldIndex) => {
                                                const FieldIcon = field.icon;
                                                return (
                                                    <div key={fieldIndex} className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <FieldIcon className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm font-medium text-gray-600">{field.label}:</span>
                                                        </div>
                                                        <span className={`text-sm font-semibold text-right max-w-32 truncate ${field.valueClass || 'text-gray-900'
                                                            }`} title={field.value}>
                                                            {field.value}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Device Information Section */}
                        {location.device && (
                            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <div className="bg-indigo-500 p-2 rounded-lg">
                                            <Smartphone className="h-4 w-4 text-white" />
                                        </div>
                                        <h4 className="font-semibold text-gray-800">Associated Device Details</h4>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Database className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-600">Device ID:</span>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{location.device.id || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Smartphone className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-600">Device Name:</span>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{location.device.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Database className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-600">Device IMEI:</span>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{location.device.imei || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-600">Phone:</span>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{location.device.phoneNo || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-600">Email:</span>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900 truncate max-w-32" title={location.device.emailAddress || 'N/A'}>
                                                {location.device.emailAddress || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-600">Device Created:</span>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {location.device.createdAt ? formatCreatedDate(location.device.createdAt) : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const LocationDataAccordion: React.FC = () => {
    const { locationData, loading } = useLocationData();
    const [openItems, setOpenItems] = useState<Set<number>>(new Set());

    const toggleAccordion = (locationId: number) => {
        const newOpenItems = new Set(openItems);
        if (newOpenItems.has(locationId)) {
            newOpenItems.delete(locationId);
        } else {
            newOpenItems.add(locationId);
        }
        setOpenItems(newOpenItems);
    };

    const expandAll = () => {
        setOpenItems(new Set(locationData.map(location => location.id)));
    };

    const collapseAll = () => {
        setOpenItems(new Set());
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-2 text-gray-600">Loading location data...</p>
            </div>
        );
    }

    if (locationData.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                <MapPin className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                <h3 className="text-lg font-medium mb-1">No location data found</h3>
                <p>Try adjusting your filters or refreshing the data.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Control Buttons */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold text-gray-800">Location Data Details</h2>
                    <span className="text-sm text-gray-500">({locationData.length} records)</span>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={expandAll}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200"
                    >
                        Expand All
                    </button>
                    <button
                        onClick={collapseAll}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                    >
                        Collapse All
                    </button>
                </div>
            </div>

            {/* Accordion Items */}
            <div className="space-y-4">
                {locationData.map((location) => (
                    <AccordionItem
                        key={location.id}
                        location={location}
                        isOpen={openItems.has(location.id)}
                        onToggle={() => toggleAccordion(location.id)}
                    />
                ))}
            </div>

            {/* Pagination */}
            <Pagination />
        </div>
    );
}; 