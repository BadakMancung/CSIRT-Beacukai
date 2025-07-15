import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    PlusIcon, 
    TrashIcon, 
    PencilIcon, 
    EnvelopeIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function Index({ auth, recipients = [], envEmails = [], adminEmail, mailConfigured }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingRecipient, setEditingRecipient] = useState(null);
    const [testEmail, setTestEmail] = useState(adminEmail || '');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        email: '',
        name: '',
        role: 'staff',
        notification_types: 'all',
        active: true
    });

    const { data: testData, setData: setTestData, post: postTest, processing: testProcessing } = useForm({
        email: testEmail
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingRecipient) {
            put(route('notifications.update', editingRecipient.id), {
                onSuccess: () => {
                    setEditingRecipient(null);
                    reset();
                }
            });
        } else {
            post(route('notifications.store'), {
                onSuccess: () => {
                    setShowAddForm(false);
                    reset();
                }
            });
        }
    };

    const handleEdit = (recipient) => {
        setEditingRecipient(recipient);
        setData({
            email: recipient.email,
            name: recipient.name,
            role: recipient.role,
            notification_types: recipient.notification_types,
            active: recipient.active === 'yes'
        });
        setShowAddForm(true);
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus email recipient ini?')) {
            router.delete(route('notifications.destroy', id));
        }
    };

    const handleTestEmail = (e) => {
        e.preventDefault();
        postTest(route('notifications.test'), {
            data: { email: testData.email }
        });
    };

    const resetForm = () => {
        setShowAddForm(false);
        setEditingRecipient(null);
        reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Email Notifications</h2>}
        >
            <Head title="Email Notifications" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Email Configuration Status */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <EnvelopeIcon className="h-6 w-6 text-gray-500" />
                                <h3 className="text-lg font-medium text-gray-900">Konfigurasi Email</h3>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                {mailConfigured ? (
                                    <>
                                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                        <span className="text-green-700">Email dikonfigurasi dengan benar</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircleIcon className="h-5 w-5 text-red-500" />
                                        <span className="text-red-700">Email belum dikonfigurasi. Periksa .env file.</span>
                                    </>
                                )}
                            </div>

                            {mailConfigured && (
                                <div className="mt-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Test Email</h4>
                                    <form onSubmit={handleTestEmail} className="flex space-x-2">
                                        <input
                                            type="email"
                                            value={testData.email}
                                            onChange={(e) => setTestData('email', e.target.value)}
                                            placeholder="Email address"
                                            className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <button
                                            type="submit"
                                            disabled={testProcessing}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            {testProcessing ? 'Sending...' : 'Send Test'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Environment Emails */}
                    {envEmails.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                            <div className="flex items-center space-x-2 mb-3">
                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                                <h3 className="text-lg font-medium text-yellow-800">Email dari .env (Fallback)</h3>
                            </div>
                            <p className="text-yellow-700 mb-3">
                                Email berikut dikonfigurasi di .env sebagai fallback jika spreadsheet tidak tersedia:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {envEmails.map((email, index) => (
                                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                                        {email}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recipients Management */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Email Recipients (Spreadsheet)</h3>
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <PlusIcon className="h-4 w-4 mr-2" />
                                    Add Recipient
                                </button>
                            </div>

                            {/* Add/Edit Form */}
                            {showAddForm && (
                                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                                        {editingRecipient ? 'Edit Recipient' : 'Add New Recipient'}
                                    </h4>
                                    
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                />
                                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                />
                                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                                <select
                                                    value={data.role}
                                                    onChange={(e) => setData('role', e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                >
                                                    <option value="staff">Staff</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="supervisor">Supervisor</option>
                                                </select>
                                                {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Notification Types</label>
                                                <select
                                                    value={data.notification_types}
                                                    onChange={(e) => setData('notification_types', e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                >
                                                    <option value="all">All Notifications</option>
                                                    <option value="contacts">Contacts Only</option>
                                                    <option value="events">Events Only</option>
                                                    <option value="articles">Articles Only</option>
                                                    <option value="contacts,events">Contacts & Events</option>
                                                    <option value="contacts,articles">Contacts & Articles</option>
                                                    <option value="events,articles">Events & Articles</option>
                                                </select>
                                                {errors.notification_types && <p className="mt-1 text-sm text-red-600">{errors.notification_types}</p>}
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={data.active}
                                                onChange={(e) => setData('active', e.target.checked)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 block text-sm text-gray-900">Active</label>
                                        </div>

                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                {processing ? 'Saving...' : editingRecipient ? 'Update' : 'Add'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Recipients Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email & Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Notifications
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recipients.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                    No email recipients configured. Add one above.
                                                </td>
                                            </tr>
                                        ) : (
                                            recipients.map((recipient) => (
                                                <tr key={recipient.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {recipient.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {recipient.email}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {recipient.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-gray-900">
                                                            {recipient.notification_types}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {recipient.active === 'yes' ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                Active
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                Inactive
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleEdit(recipient)}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                <PencilIcon className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(recipient.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <TrashIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
