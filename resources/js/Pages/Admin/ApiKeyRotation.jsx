import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function ApiKeyRotation({ auth, needsRotation, rotationHistory, rotationSchedule }) {
    const [selectedService, setSelectedService] = useState('sendgrid');
    const [isRotating, setIsRotating] = useState(false);
    const [emergencyReason, setEmergencyReason] = useState('');
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);

    const serviceLabels = {
        sendgrid: 'SendGrid API Key',
        telegram: 'Telegram Bot Token',
        file_encryption: 'File Encryption Key',
        admin_password: 'Admin Password'
    };

    const handleRotate = async (service, isEmergency = false) => {
        setIsRotating(true);
        
        try {
            const endpoint = isEmergency ? '/admin/api-keys/emergency-rotate' : '/admin/api-keys/rotate';
            const data = isEmergency 
                ? { service, reason: emergencyReason }
                : { service, backup: true };

            await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(data)
            });

            // Refresh page to show updated data
            router.reload();
            
            if (isEmergency) {
                setShowEmergencyModal(false);
                setEmergencyReason('');
            }
        } catch (error) {
            console.error('Rotation failed:', error);
            alert('Rotation failed: ' + error.message);
        } finally {
            setIsRotating(false);
        }
    };

    const getStatusColor = (daysUntilRotation) => {
        if (daysUntilRotation < 0) return 'text-red-600 bg-red-100';
        if (daysUntilRotation < 7) return 'text-yellow-600 bg-yellow-100';
        return 'text-green-600 bg-green-100';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">API Key Rotation Management</h2>}
        >
            <Head title="API Key Rotation" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Status Overview */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">🔐 API Key Status Overview</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {Object.entries(needsRotation).map(([service, data]) => (
                                    <div key={service} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium">{serviceLabels[service]}</h4>
                                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(data.days_until_rotation)}`}>
                                                {data.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Last rotated: {data.last_rotation || 'Never'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Next rotation: {data.days_until_rotation > 0 
                                                ? `${data.days_until_rotation} days` 
                                                : 'OVERDUE'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Manual Rotation */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">🔄 Manual Rotation</h3>
                            
                            <div className="flex items-center space-x-4 mb-4">
                                <select 
                                    value={selectedService}
                                    onChange={(e) => setSelectedService(e.target.value)}
                                    className="border rounded-md px-3 py-2"
                                >
                                    {Object.entries(serviceLabels).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                    <option value="all">All Services</option>
                                </select>
                                
                                <button 
                                    onClick={() => handleRotate(selectedService)}
                                    disabled={isRotating}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                >
                                    {isRotating ? 'Rotating...' : 'Rotate Now'}
                                </button>
                            </div>
                            
                            <p className="text-sm text-gray-600">
                                ⚠️ Manual rotation will immediately generate new credentials and backup the old ones.
                            </p>
                        </div>
                    </div>

                    {/* Emergency Rotation */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">🚨 Emergency Rotation</h3>
                            
                            <button 
                                onClick={() => setShowEmergencyModal(true)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Emergency Rotate
                            </button>
                            
                            <p className="text-sm text-gray-600 mt-2">
                                Use this for immediate rotation when keys are potentially compromised.
                            </p>
                        </div>
                    </div>

                    {/* Rotation History */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">📊 Recent Rotation History</h3>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-2 text-left">Service</th>
                                            <th className="px-4 py-2 text-left">Date</th>
                                            <th className="px-4 py-2 text-left">Type</th>
                                            <th className="px-4 py-2 text-left">Status</th>
                                            <th className="px-4 py-2 text-left">Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rotationHistory.map((record, index) => (
                                            <tr key={index} className="border-t">
                                                <td className="px-4 py-2">{serviceLabels[record.service] || record.service}</td>
                                                <td className="px-4 py-2">{record.date}</td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        record.type === 'emergency' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                                    }`}>
                                                        {record.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        record.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                    }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">{record.reason || 'Scheduled rotation'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Emergency Modal */}
            {showEmergencyModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">🚨 Emergency Rotation</h3>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Service:
                                </label>
                                <select 
                                    value={selectedService}
                                    onChange={(e) => setSelectedService(e.target.value)}
                                    className="w-full border rounded-md px-3 py-2"
                                >
                                    {Object.entries(serviceLabels).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for emergency rotation:
                                </label>
                                <textarea
                                    value={emergencyReason}
                                    onChange={(e) => setEmergencyReason(e.target.value)}
                                    className="w-full border rounded-md px-3 py-2"
                                    rows="3"
                                    placeholder="Describe why emergency rotation is needed..."
                                />
                            </div>
                            
                            <div className="flex justify-end space-x-2">
                                <button 
                                    onClick={() => setShowEmergencyModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleRotate(selectedService, true)}
                                    disabled={!emergencyReason.trim() || isRotating}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                                >
                                    {isRotating ? 'Rotating...' : 'Emergency Rotate'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
