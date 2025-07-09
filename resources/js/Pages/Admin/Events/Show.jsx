import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ event }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'upcoming':
                return 'bg-blue-100 text-blue-800';
            case 'ongoing':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Event Details
                </h2>
            }
        >
            <Head title={`Event: ${event.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6 flex justify-between items-center">
                                <Link
                                    href={route('events.index')}
                                    className="rounded-md bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
                                >
                                    ← Back to Events
                                </Link>
                                <div className="space-x-2">
                                    <Link
                                        href={route('events.edit', event.id)}
                                        className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                                    >
                                        Edit Event
                                    </Link>
                                    <Link
                                        href={route('public.events.show', event.id)}
                                        className="rounded-md bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                                        target="_blank"
                                    >
                                        View Public
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                                            {event.status}
                                        </span>
                                        <span>Created: {formatDate(event.created_at)}</span>
                                        <span>Updated: {formatDate(event.updated_at)}</span>
                                    </div>
                                </div>

                                {event.featured_image && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Featured Image</h3>
                                        <img 
                                            src={`/storage/${event.featured_image}`} 
                                            alt={event.title}
                                            className="max-w-md h-auto object-cover rounded-md shadow-sm"
                                        />
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                                    <div className="prose max-w-none text-gray-700 bg-gray-50 p-6 rounded-md">
                                        {event.description.split('\n').map((paragraph, index) => (
                                            paragraph.trim() && (
                                                <p key={index} className="mb-4">
                                                    {paragraph}
                                                </p>
                                            )
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Event Information</h3>
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">ID</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{event.id}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                                                    {event.status}
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Location</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{event.location || 'Not specified'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Max Participants</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{event.max_participants || 'Unlimited'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Start Date & Time</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatDate(event.event_date)}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">End Date & Time</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatDate(event.end_date)}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Registration URL</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {event.registration_url ? (
                                                    <a 
                                                        href={event.registration_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 underline"
                                                    >
                                                        {event.registration_url}
                                                    </a>
                                                ) : 'Not provided'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Featured Image</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {event.featured_image ? 'Yes' : 'No'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Created At</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatDate(event.created_at)}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Updated At</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatDate(event.updated_at)}</dd>
                                        </div>
                                    </dl>
                                </div>

                                {event.registration_url && (
                                    <div className="border-t pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Registration</h3>
                                        <a 
                                            href={event.registration_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
                                        >
                                            Register for Event
                                            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
