import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';

export default function Index({ articles }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
            destroy(route('articles.destroy', id));
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Manajemen Artikel
                    </h2>
                    <Link 
                        href={route('articles.create')}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Tambah Artikel
                    </Link>
                </div>
            }
        >
            <Head title="Manajemen Artikel" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {articles.data.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Artikel
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Tanggal
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {articles.data.map((article) => (
                                                    <tr key={article.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                {article.image && (
                                                                    <div className="flex-shrink-0 h-12 w-12">
                                                                        <img 
                                                                            className="h-12 w-12 rounded-lg object-cover" 
                                                                            src={`/storage/${article.image}`} 
                                                                            alt={article.title} 
                                                                        />
                                                                    </div>
                                                                )}
                                                                <div className={article.image ? "ml-4" : ""}>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {article.title}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {article.author || 'No author'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                article.is_published 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                                {article.is_published ? 'Published' : 'Draft'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {article.published_at ? formatDate(article.published_at) : 'Not published'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                <Link 
                                                                    href={route('articles.show', article.id)}
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                >
                                                                    View
                                                                </Link>
                                                                <Link 
                                                                    href={route('articles.edit', article.id)}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                >
                                                                    Edit
                                                                </Link>
                                                                <button 
                                                                    onClick={() => handleDelete(article.id)}
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
                                    {(articles.prev_page_url || articles.next_page_url) && (
                                        <div className="mt-6 flex justify-between items-center">
                                            {articles.prev_page_url ? (
                                                <Link 
                                                    href={articles.prev_page_url}
                                                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md"
                                                >
                                                    Previous
                                                </Link>
                                            ) : (
                                                <div></div>
                                            )}

                                            <span className="text-sm text-gray-700">
                                                Page {articles.current_page} of {articles.last_page}
                                            </span>

                                            {articles.next_page_url ? (
                                                <Link 
                                                    href={articles.next_page_url}
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No articles</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new article.</p>
                                    <div className="mt-6">
                                        <Link 
                                            href={route('articles.create')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            Tambah Artikel
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
