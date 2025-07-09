import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Welcome to CSIRT Admin Dashboard
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Manage your CSIRT website content, articles, and events from here.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-medium text-gray-900">Articles</h4>
                                        <p className="text-sm text-gray-500">Manage website articles and news</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex space-x-3">
                                    <Link
                                        href={route('articles.index')}
                                        className="text-sm bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded"
                                    >
                                        View All
                                    </Link>
                                    <Link
                                        href={route('articles.create')}
                                        className="text-sm bg-green-500 hover:bg-green-700 text-white px-3 py-2 rounded"
                                    >
                                        Create New
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-medium text-gray-900">Events</h4>
                                        <p className="text-sm text-gray-500">Manage upcoming events and workshops</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex space-x-3">
                                    <Link
                                        href={route('events.index')}
                                        className="text-sm bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded"
                                    >
                                        View All
                                    </Link>
                                    <Link
                                        href={route('events.create')}
                                        className="text-sm bg-green-500 hover:bg-green-700 text-white px-3 py-2 rounded"
                                    >
                                        Create New
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-medium text-gray-900">Public Site</h4>
                                        <p className="text-sm text-gray-500">View the public website</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link
                                        href={route('home')}
                                        className="text-sm bg-purple-500 hover:bg-purple-700 text-white px-3 py-2 rounded"
                                        target="_blank"
                                    >
                                        Visit Site
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity or Statistics can be added here */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Quick Tips
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Use the Articles section to create and manage news, announcements, and blog posts</li>
                                <li>• Use the Events section to promote upcoming security workshops, trainings, and conferences</li>
                                <li>• Always preview your content before publishing to ensure proper formatting</li>
                                <li>• Upload high-quality images for better visual appeal</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
