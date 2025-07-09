import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';

export default function Index({ events }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus event ini?')) {
            destroy(route('events.destroy', id));
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isUpcoming = (dateString) => {
        return new Date(dateString) > new Date();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Manajemen Event
                    </h2>
                    <Link 
                        href={route('events.create')}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Tambah Event
                    </Link>
                </div>
            }
        >
            <Head title="Manajemen Event" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {events.data.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Event
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Tanggal Event
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Lokasi
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {events.data.map((event) => (
                                                    <tr key={event.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                {event.image && (
                                                                    <div className="flex-shrink-0 h-12 w-12">
                                                                        <img 
                                                                            className="h-12 w-12 rounded-lg object-cover" 
                                                                            src={`/storage/${event.image}`} 
                                                                            alt={event.title} 
                                                                        />
                                                                    </div>
                                                                )}
                                                                <div className={event.image ? "ml-4" : ""}>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {event.title}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                                                        {event.description}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex flex-col space-y-1">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    event.is_published 
                                                                        ? 'bg-green-100 text-green-800' 
                                                                        : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                    {event.is_published ? 'Published' : 'Draft'}
                                                                </span>
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    isUpcoming(event.event_date)
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                    {isUpcoming(event.event_date) ? 'Upcoming' : 'Past'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <div>
                                                                <div>{formatDate(event.event_date)}</div>
                                                                {event.event_end_date && event.event_end_date !== event.event_date && (
                                                                    <div className="text-xs text-gray-400">
                                                                        s/d {formatDate(event.event_end_date)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {event.location || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                <Link 
                                                                    href={route('events.show', event.id)}
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                >
                                                                    View
                                                                </Link>
                                                                <Link 
                                                                    href={route('events.edit', event.id)}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                >
                                                                    Edit
                                                                </Link>
                                                                <button 
                                                                    onClick={() => handleDelete(event.id)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {(events.prev_page_url || events.next_page_url) && (
                                        <div className="mt-6 flex justify-between items-center">
                                            {events.prev_page_url ? (
                                                <Link 
                                                    href={events.prev_page_url}
                                                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md"
                                                >
                                                    Previous
                                                </Link>
                                            ) : (
                                                <div></div>
                                            )}

                                            <span className="text-sm text-gray-700">
                                                Page {events.current_page} of {events.last_page}
                                            </span>

                                            {events.next_page_url ? (
                                                <Link 
                                                    href={events.next_page_url}
                                                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md"
                                                >
                                                    Next
                                                </Link>
                                            ) : (
                                                <div></div>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new event.</p>
                                    <div className="mt-6">
                                        <Link 
                                            href={route('events.create')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            Tambah Event
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
