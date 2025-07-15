import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function ArticleShow({ article, relatedArticles }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <PublicLayout>
            <Head title={`${article.title} - CSIRT Bea Cukai`} />
            
            {/* Breadcrumb */}
            <section className="bg-gray-50 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600">Beranda</Link>
                        <span className="mx-2">/</span>
                        <Link href="/artikel" className="hover:text-blue-600">Artikel</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 truncate">{article.title}</span>
                    </nav>
                </div>
            </section>

            {/* Article Content */}
            <article className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Article Header */}
                    <header className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            {article.title}
                        </h1>
                        
                        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {formatDate(article.published_at)}
                            </div>
                            
                            {article.author && (
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {article.author}
                                </div>
                            )}
                        </div>

                        {article.image && (
                            <img 
                                src={article.image_url || `/storage/${article.image}`} 
                                alt={article.title}
                                className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg mb-8"
                            />
                        )}

                        <div className="text-xl text-gray-700 leading-relaxed mb-8 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                            {article.excerpt}
                        </div>
                    </header>

                    {/* Article Body */}
                    <div className="prose prose-lg max-w-none">
                        <div 
                            className="text-gray-800 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }}
                        />
                    </div>

                    {/* Article Footer */}
                    <footer className="mt-12 pt-8 border-t border-gray-200">
                        <div className="flex flex-wrap justify-between items-center">
                            <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                <span className="text-gray-600">Bagikan artikel:</span>
                                <div className="flex space-x-3">
                                    <a 
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                        </svg>
                                    </a>
                                    <a 
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-700 hover:text-blue-900"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            
                            <Link 
                                href="/artikel"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                ← Kembali ke Artikel
                            </Link>
                        </div>
                    </footer>
                </div>
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Artikel Terkait
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedArticles.map((relatedArticle) => (
                                <article key={relatedArticle.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                    {relatedArticle.image && (
                                        <img 
                                            src={relatedArticle.image_url || `/storage/${relatedArticle.image}`} 
                                            alt={relatedArticle.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                                            {relatedArticle.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {relatedArticle.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                {formatDate(relatedArticle.published_at)}
                                            </span>
                                            <Link 
                                                href={`/artikel/${relatedArticle.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                                            >
                                                Baca →
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-16 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Butuh Bantuan Keamanan Siber?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Tim CSIRT Bea Cukai siap membantu dengan pertanyaan atau insiden keamanan siber
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            href="/hubungi-kami"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100 transition-colors"
                        >
                            Hubungi Kami
                        </Link>
                        <Link 
                            href="/layanan"
                            className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            Lihat Layanan
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
