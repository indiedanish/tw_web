import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Database, Globe, Shield, Bell, Users, Palette, Save, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { fetchDefaultConfig, updateDefaultConfig, DefaultConfig, ConfigUpdateRequest } from '../services/api';

interface ConfigsProps {
    onBack: () => void;
}

export const Configs: React.FC<ConfigsProps> = ({ onBack }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [config, setConfig] = useState<DefaultConfig | null>(null);
    const [formData, setFormData] = useState<Partial<ConfigUpdateRequest>>({});

    useEffect(() => {
        loadConfiguration();
    }, []);

    const loadConfiguration = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchDefaultConfig();
            setConfig(response.data);

            // Convert string values to numbers for form
            const formValues: ConfigUpdateRequest = {
                gpsTimer: parseInt(response.data.gpsTimer),
                configTimer: parseInt(response.data.configTimer),
                uploadTimer: parseInt(response.data.uploadTimer),
                retryCounter: parseInt(response.data.retryCounter),
                angleThreshold: parseInt(response.data.angleThreshold),
                overSpeedingThreshold: parseInt(response.data.overSpeedingThreshold),
                travelStartTimer: parseInt(response.data.travelStartTimer),
                travelStopTimer: parseInt(response.data.travelStopTimer),
                movingTimer: parseInt(response.data.movingTimer),
                stopTimer: parseInt(response.data.stopTimer),
                distanceThreshold: parseInt(response.data.distanceThreshold),
                heartbeatTimer: parseInt(response.data.heartbeatTimer),
                liveStatusUpdateTimer: parseInt(response.data.liveStatusUpdateTimer),
            };
            setFormData(formValues);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load configuration');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof ConfigUpdateRequest, value: string) => {
        const numericValue = parseInt(value) || 0;
        setFormData(prev => ({
            ...prev,
            [field]: numericValue
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            const response = await updateDefaultConfig(formData as ConfigUpdateRequest);
            setSuccess('Configuration updated successfully!');
            setConfig(response.data);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update configuration');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (config) {
            const resetValues: ConfigUpdateRequest = {
                gpsTimer: parseInt(config.gpsTimer),
                configTimer: parseInt(config.configTimer),
                uploadTimer: parseInt(config.uploadTimer),
                retryCounter: parseInt(config.retryCounter),
                angleThreshold: parseInt(config.angleThreshold),
                overSpeedingThreshold: parseInt(config.overSpeedingThreshold),
                travelStartTimer: parseInt(config.travelStartTimer),
                travelStopTimer: parseInt(config.travelStopTimer),
                movingTimer: parseInt(config.movingTimer),
                stopTimer: parseInt(config.stopTimer),
                distanceThreshold: parseInt(config.distanceThreshold),
                heartbeatTimer: parseInt(config.heartbeatTimer),
                liveStatusUpdateTimer: parseInt(config.liveStatusUpdateTimer),
            };
            setFormData(resetValues);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading configuration...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </button>
                        <div className="border-l border-gray-300 h-6 mx-2"></div>
                        <div className="flex items-center">
                            <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-2 rounded-lg mr-3">
                                <Settings className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Default Configuration</h1>
                                <p className="text-gray-600">Manage tracking device settings and timers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {error && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        {success}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* GPS and Location Settings */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">GPS & Location</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">GPS Timer (seconds)</label>
                                    <input
                                        type="number"
                                        value={formData.gpsTimer || ''}
                                        onChange={(e) => handleInputChange('gpsTimer', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Distance Threshold (meters)</label>
                                    <input
                                        type="number"
                                        value={formData.distanceThreshold || ''}
                                        onChange={(e) => handleInputChange('distanceThreshold', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Angle Threshold (degrees)</label>
                                    <input
                                        type="number"
                                        value={formData.angleThreshold || ''}
                                        onChange={(e) => handleInputChange('angleThreshold', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="1"
                                        max="360"
                                    />
                                </div>
                            </div>

                            {/* Timing Configuration */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Timing Configuration</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Config Timer (seconds)</label>
                                    <input
                                        type="number"
                                        value={formData.configTimer || ''}
                                        onChange={(e) => handleInputChange('configTimer', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Timer (seconds)</label>
                                    <input
                                        type="number"
                                        value={formData.uploadTimer || ''}
                                        onChange={(e) => handleInputChange('uploadTimer', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Heartbeat Timer (seconds)</label>
                                    <input
                                        type="number"
                                        value={formData.heartbeatTimer || ''}
                                        onChange={(e) => handleInputChange('heartbeatTimer', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Live Status Update Timer (seconds)</label>
                                    <input
                                        type="number"
                                        value={formData.liveStatusUpdateTimer || ''}
                                        onChange={(e) => handleInputChange('liveStatusUpdateTimer', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="1"
                                    />
                                </div>
                            </div>

                            {/* Movement & Behavior */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Movement & Behavior</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Travel Start Timer (seconds)</label>
                                    <input
                                        type="number"
                                        value={formData.travelStartTimer || ''}
                                        onChange={(e) => handleInputChange('travelStartTimer', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Travel Stop Timer (seconds)</label>
                                    <input
                                        type="number"
                                        value={formData.travelStopTimer || ''}
                                        onChange={(e) => handleInputChange('travelStopTimer', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Moving Timer (seconds)</label>
                                    <input
                                        type="number"
                                        value={formData.movingTimer || ''}
                                        onChange={(e) => handleInputChange('movingTimer', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stop Timer (seconds)</label>
                                    <input
                                        type="number"
                                        value={formData.stopTimer || ''}
                                        onChange={(e) => handleInputChange('stopTimer', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="1"
                                    />
                                </div>
                            </div>

                            {/* Additional Settings */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Additional Settings</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Retry Counter</label>
                                    <input
                                        type="number"
                                        value={formData.retryCounter || ''}
                                        onChange={(e) => handleInputChange('retryCounter', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Over Speeding Threshold (km/h)</label>
                                    <input
                                        type="number"
                                        value={formData.overSpeedingThreshold || ''}
                                        onChange={(e) => handleInputChange('overSpeedingThreshold', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="1"
                                    />
                                </div>

                                {config && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Base URL (Read Only)</label>
                                        <input
                                            type="text"
                                            value={config.baseUrl}
                                            readOnly
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 px-6 py-4">
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleReset}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Reset
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 