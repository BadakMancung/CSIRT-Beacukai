import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ article }) {
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Article Details
                </h2>
            }
        >
            <Head title={`Article: ${article.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6 flex justify-between items-center">
                                <Link
                                    href={route('articles.index')}
                                    className="rounded-md bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
                                >
                                    ← Back to Articles
                                </Link>
                                <div className="space-x-2">
                                    <Link
                                        href={route('articles.edit', article.id)}
                                        className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                                    >
                                        Edit Article
                                    </Link>
                                    <Link
                                        href={route('public.articles.show', article.id)}
                                        className="rounded-md bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                                        target="_blank"
                                    >
                                        View Public
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{article.title}</h1>
                                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            article.is_published 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {article.is_published ? 'Published' : 'Draft'}
                                        </span>
                                        <span>Created: {formatDate(article.created_at)}</span>
                                        <span>Updated: {formatDate(article.updated_at)}</span>
                                        {article.published_at && (
                                            <span>Published: {formatDate(article.published_at)}</span>
                                        )}
                                    </div>
                                </div>

                                {(article.image || article.image_url) && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Featured Image</h3>
                                        <img 
                                            src={article.image_url || `/storage/${article.image}`} 
                                            alt={article.title}
                                            className="max-w-md h-auto object-cover rounded-md shadow-sm"
                                        />
                                    </div>
                                )}

                                {article.excerpt && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Excerpt</h3>
                                        <div className="prose prose-sm text-gray-600 bg-gray-50 p-4 rounded-md">
                                            {article.excerpt}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Content</h3>
                                    <div className="prose max-w-none text-gray-700 bg-gray-50 p-6 rounded-md">
                                        {article.content.split('\n').map((paragraph, index) => (
                                            paragraph.trim() && (
                                                <p key={index} className="mb-4">
                                                    {paragraph}
                                                </p>
                                            )
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Article Information</h3>
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">ID</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{article.id}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Author</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{article.author || 'Unknown'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    article.is_published 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {article.is_published ? 'Published' : 'Draft'}
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Created At</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatDate(article.created_at)}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Updated At</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatDate(article.updated_at)}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Published At</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatDate(article.published_at)}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Featured Image</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {(article.image || article.image_url) ? 'Yes' : 'No'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
