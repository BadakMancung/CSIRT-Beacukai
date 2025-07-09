import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function Home({ articles }) {
    return (
        <PublicLayout>
            <Head title="Beranda - CSIRT Bea Cukai" />
            
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 text-white overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    {/* Animated Grid */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="grid grid-cols-12 gap-4 h-full animate-pulse">
                            {[...Array(48)].map((_, i) => (
                                <div key={i} className="border border-blue-300 rounded-sm" 
                                     style={{ 
                                         animationDelay: `${i * 0.1}s`,
                                         animationDuration: '3s'
                                     }}
                                />
                            ))}
                        </div>
                    </div>
                    
                    {/* Floating Shield Icons */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-20 left-10 animate-bounce" style={{ animationDelay: '0s', animationDuration: '4s' }}>
                            <svg className="w-8 h-8 text-blue-300 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10.5V11.5C15.4,11.5 16,12.4 16,13V16C16,16.6 15.6,17 15,17H9C8.4,17 8,16.6 8,16V13C8,12.4 8.4,11.5 9,11.5V10.5C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,8.7 10.2,10.5V11.5H13.8V10.5C13.8,8.7 12.8,8.2 12,8.2Z"/>
                            </svg>
                        </div>
                        <div className="absolute top-32 right-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '5s' }}>
                            <svg className="w-6 h-6 text-indigo-300 opacity-40" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
                            </svg>
                        </div>
                        <div className="absolute bottom-32 left-1/4 animate-bounce" style={{ animationDelay: '2s', animationDuration: '6s' }}>
                            <svg className="w-10 h-10 text-cyan-300 opacity-25" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z"/>
                            </svg>
                        </div>
                        <div className="absolute top-1/2 right-10 animate-bounce" style={{ animationDelay: '3s', animationDuration: '4.5s' }}>
                            <svg className="w-7 h-7 text-blue-200 opacity-35" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17,9H7V7A5,5 0 0,1 12,2A5,5 0 0,1 17,7V9M14,16A2,2 0 0,1 12,18A2,2 0 0,1 10,16A2,2 0 0,1 12,14A2,2 0 0,1 14,16M20,9A2,2 0 0,1 22,11V21A2,2 0 0,1 20,23H4A2,2 0 0,1 2,21V11A2,2 0 0,1 4,9H20Z"/>
                            </svg>
                        </div>
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="flex items-center justify-between">
                        {/* Left Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="animate-fade-in-up">
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                                    <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                        CSIRT
                                    </span>
                                    <br />
                                    <span className="text-white">Bea Cukai</span>
                                </h1>
                                <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto lg:mx-0 leading-relaxed text-blue-100">
                                    Tim Tanggap Insiden Keamanan Siber yang melindungi infrastruktur teknologi informasi 
                                    Direktorat Jenderal Bea dan Cukai dari ancaman keamanan siber
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Link 
                                        href="/hubungi-kami"
                                        className="group bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                    >
                                        <span className="flex items-center justify-center">
                                            🚨 Laporkan Insiden
                                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </Link>
                                    <Link 
                                        href="/layanan"
                                        className="group border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
                                    >
                                        <span className="flex items-center justify-center">
                                            🛡️ Lihat Layanan
                                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Content - 3D Shield */}
                        <div className="hidden lg:flex flex-1 justify-center items-center">
                            <div className="relative">
                                {/* Main 3D Shield */}
                                <div className="relative group">
                                    <div className="w-80 h-80 relative transform rotate-12 group-hover:rotate-6 transition-transform duration-700">
                                        {/* Shield Shadow */}
                                        <div className="absolute inset-0 bg-black/20 rounded-full blur-xl transform translate-x-4 translate-y-4"></div>
                                        
                                        {/* Shield Base */}
                                        <div className="relative w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 rounded-full shadow-2xl">
                                            {/* Shield Pattern */}
                                            <div className="absolute inset-4 bg-gradient-to-br from-white/20 to-transparent rounded-full">
                                                <div className="absolute inset-4 border-2 border-white/30 rounded-full">
                                                    {/* Center Lock Icon */}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <svg className="w-32 h-32 text-white drop-shadow-lg animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10.5V11.5C15.4,11.5 16,12.4 16,13V16C16,16.6 15.6,17 15,17H9C8.4,17 8,16.6 8,16V13C8,12.4 8.4,11.5 9,11.5V10.5C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,8.7 10.2,10.5V11.5H13.8V10.5C13.8,8.7 12.8,8.2 12,8.2Z"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Animated Ring */}
                                            <div className="absolute -inset-2 border-4 border-cyan-300/50 rounded-full animate-ping"></div>
                                            <div className="absolute -inset-1 border-2 border-blue-300/70 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                    
                                    {/* Orbiting Security Icons */}
                                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                                        <div className="relative w-full h-full">
                                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                                <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M9,12L11,14L15,10M21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5Z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                                                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="absolute top-1/2 -left-4 transform -translate-y-1/2">
                                                <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center shadow-lg">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12,3A4,4 0 0,1 16,7A4,4 0 0,1 12,11A4,4 0 0,1 8,7A4,4 0 0,1 12,3M12,13C16.42,13 20,14.79 20,17V20H4V17C4,14.79 7.58,13 12,13Z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
                                                <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center shadow-lg">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes fade-in-up {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-fade-in-up {
                        animation: fade-in-up 1s ease-out;
                    }
                `}</style>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">24/7</h3>
                            <p className="text-gray-600">Monitoring & Response</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Fast</h3>
                            <p className="text-gray-600">Incident Response</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Secure</h3>
                            <p className="text-gray-600">Infrastructure Protection</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Articles Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Artikel Cyber Security
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Tetap update dengan perkembangan terbaru di dunia keamanan siber
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <article key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                {article.image && (
                                    <img 
                                        src={`/storage/${article.image}`} 
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
                                        <span className="text-sm text-gray-500">
                                            {new Date(article.published_at).toLocaleDateString('id-ID')}
                                        </span>
                                        <Link 
                                            href={`/artikel/${article.id}`}
                                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                                        >
                                            Baca Selengkapnya →
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                    
                    <div className="text-center mt-12">
                        <Link 
                            href="/artikel"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            Lihat Semua Artikel
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Butuh Bantuan Keamanan Siber?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Tim CSIRT Bea Cukai siap membantu 24/7 untuk menangani insiden keamanan siber
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            href="/hubungi-kami"
                            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Hubungi Kami
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
