import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';

export default function Edit({ article }) {
    // Format datetime for HTML datetime-local input
    const formatDateTimeLocal = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    const { data, setData, put, processing, errors } = useForm({
        title: article.title || '',
        content: article.content || '',
        excerpt: article.excerpt || '',
        image: null,
        author: article.author || '',
        is_published: Boolean(article.is_published),
        published_at: formatDateTimeLocal(article.published_at),
    });

    const submit = (e) => {
        e.preventDefault();
        
        // Create FormData if image is uploaded, otherwise use regular object
        if (data.image) {
            // Use FormData for file upload
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('content', data.content);
            formData.append('excerpt', data.excerpt);
            formData.append('author', data.author);
            formData.append('is_published', data.is_published ? '1' : '0');
            formData.append('published_at', data.published_at);
            formData.append('image', data.image);
            formData.append('_method', 'PUT'); // Laravel method spoofing
            
            // Use post with _method for file uploads
            router.post(route('articles.update', article.id), formData, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Handle success
                }
            });
        } else {
            // Regular PUT request without file
            put(route('articles.update', article.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Article
                </h2>
            }
        >
            <Head title="Edit Article" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <Link
                                    href={route('articles.index')}
                                    className="rounded-md bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
                                >
                                    ← Back to Articles
                                </Link>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                        Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
                                </div>

                                <div>
                                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                                        Excerpt
                                    </label>
                                    <textarea
                                        id="excerpt"
                                        rows="3"
                                        value={data.excerpt}
                                        onChange={(e) => setData('excerpt', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Brief summary of the article..."
                                    />
                                    {errors.excerpt && <div className="text-red-600 text-sm mt-1">{errors.excerpt}</div>}
                                </div>

                                <div>
                                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                        Content
                                    </label>
                                    <textarea
                                        id="content"
                                        rows="10"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.content && <div className="text-red-600 text-sm mt-1">{errors.content}</div>}
                                </div>

                                <div>
                                    <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                                        Author
                                    </label>
                                    <input
                                        id="author"
                                        type="text"
                                        value={data.author}
                                        onChange={(e) => setData('author', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Article author..."
                                    />
                                    {errors.author && <div className="text-red-600 text-sm mt-1">{errors.author}</div>}
                                </div>

                                <div>
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                        Featured Image
                                    </label>
                                    {(article.image || article.image_url) && (
                                        <div className="mt-2 mb-2">
                                            <img 
                                                src={article.image_url || `/storage/${article.image}`} 
                                                alt="Current featured image" 
                                                className="h-32 w-auto object-cover rounded-md"
                                            />
                                            <p className="text-sm text-gray-500 mt-1">Current image</p>
                                        </div>
                                    )}
                                    <input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('image', e.target.files[0])}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {errors.image && <div className="text-red-600 text-sm mt-1">{errors.image}</div>}
                                </div>

                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_published}
                                            onChange={(e) => setData('is_published', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Published</span>
                                    </label>
                                    {errors.is_published && <div className="text-red-600 text-sm mt-1">{errors.is_published}</div>}
                                </div>

                                <div>
                                    <label htmlFor="published_at" className="block text-sm font-medium text-gray-700">
                                        Published At
                                    </label>
                                    <input
                                        id="published_at"
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={(e) => setData('published_at', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.published_at && <div className="text-red-600 text-sm mt-1">{errors.published_at}</div>}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-md bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Updating...' : 'Update Article'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
