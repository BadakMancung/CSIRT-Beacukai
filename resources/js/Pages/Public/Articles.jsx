import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function Articles({ articles }) {
    return (
        <PublicLayout>
            <Head title="Artikel Cyber Security - CSIRT Bea Cukai" />
            
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Artikel Cyber Security</h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                            Informasi terkini seputar keamanan siber, tips, dan best practices 
                            untuk melindungi aset digital Anda
                        </p>
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {articles.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {articles.data.map((article) => (
                                    <article key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                        {article.image && (
                                            <img 
                                                src={article.image_url || `/storage/${article.image}`} 
                                                alt={article.title}
                                                className="w-full h-48 object-cover"
                                            />
                                        )}
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                                                {article.title}
                                            </h3>
                                            <p className="text-gray-600 mb-4 line-clamp-3">
                                                {article.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {new Date(article.published_at).toLocaleDateString('id-ID')}
                                                </div>
                                                <Link 
                                                    href={`/artikel/${article.id}`}
                                                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                                                >
                                                    Baca Selengkapnya →
                                                </Link>
                                            </div>
                                            {article.author && (
                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        {article.author}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* Pagination */}
                            {(articles.prev_page_url || articles.next_page_url) && (
                                <div className="mt-12 flex justify-center">
                                    <nav className="flex items-center space-x-4">
                                        {articles.prev_page_url && (
                                            <Link 
                                                href={articles.prev_page_url}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                ← Sebelumnya
                                            </Link>
                                        )}
                                        
                                        <span className="px-4 py-2 text-gray-500">
                                            Halaman {articles.current_page} dari {articles.last_page}
                                        </span>
                                        
                                        {articles.next_page_url && (
                                            <Link 
                                                href={articles.next_page_url}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                Selanjutnya →
                                            </Link>
                                        )}
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Belum Ada Artikel</h3>
                            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                                Saat ini belum ada artikel yang dipublikasikan. Pantai terus halaman ini untuk mendapatkan informasi terbaru seputar cyber security.
                            </p>
                            <Link 
                                href="/"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                            >
                                Kembali ke Beranda
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Categories/Topics */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Topik Artikel</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Berbagai topik cyber security yang kami bahas untuk meningkatkan kesadaran keamanan
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Threat Analysis</h3>
                            <p className="text-gray-600 text-sm">Analisis ancaman terbaru dan cara mengatasinya</p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Practices</h3>
                            <p className="text-gray-600 text-sm">Panduan praktik terbaik keamanan siber</p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Education</h3>
                            <p className="text-gray-600 text-sm">Materi edukasi dan awareness</p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Research</h3>
                            <p className="text-gray-600 text-sm">Hasil riset dan pengembangan teknologi</p>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
