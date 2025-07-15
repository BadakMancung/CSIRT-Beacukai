import { Link } from '@inertiajs/react';
import { useState } from 'react';
import SEOHead from '@/Components/SEOHead';

export default function PublicLayout({ children, title, seoData = {} }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <SEOHead 
                title={title}
                description={seoData.description}
                keywords={seoData.keywords}
                url={seoData.url}
                image={seoData.image}
                type={seoData.type}
                articleData={seoData.articleData}
            />
            
            {/* Header */}
            <header className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm">
                                    <img 
                                        src="/images/logo_beacukai.png" 
                                        alt="Logo Bea Cukai" 
                                        className="h-10 w-auto transition-transform duration-300 hover:scale-110"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">CSIRT Bea Cukai</h1>
                                    <p className="text-sm text-gray-600">Computer Security Incident Response Team</p>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <Link 
                                href="/" 
                                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Beranda
                            </Link>
                            <Link 
                                href="/profil" 
                                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Profil
                            </Link>
                            <Link 
                                href="/rfc2350" 
                                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                RFC2350
                            </Link>
                            <Link 
                                href="/layanan" 
                                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Layanan
                            </Link>
                            <Link 
                                href="/event" 
                                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Event
                            </Link>
                            <Link 
                                href="/hubungi-kami" 
                                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Hubungi Kami
                            </Link>
                            {/* <Link 
                                href="/dashboard" 
                                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Admin
                            </Link> */}
                        </nav>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 p-2 rounded-md"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                                <Link 
                                    href="/" 
                                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Beranda
                                </Link>
                                <Link 
                                    href="/profil" 
                                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Profil
                                </Link>
                                <Link 
                                    href="/rfc2350" 
                                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    RFC2350
                                </Link>
                                <Link 
                                    href="/layanan" 
                                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Layanan
                                </Link>
                                <Link 
                                    href="/event" 
                                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Event
                                </Link>
                                <Link 
                                    href="/hubungi-kami" 
                                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Hubungi Kami
                                </Link>
                                {/* <Link 
                                    href="/dashboard" 
                                    className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                                >
                                    Admin
                                </Link> */}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
                                    <img 
                                        src="/images/logo_beacukai.png" 
                                        alt="Logo Bea Cukai" 
                                        className="h-8 w-auto"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">CSIRT Bea Cukai</h3>
                                    <p className="text-sm text-gray-300">Computer Security Incident Response Team</p>
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Tim Tanggap Insiden Keamanan Siber Direktorat Jenderal Bea dan Cukai 
                                bertugas untuk melindungi infrastruktur teknologi informasi dari berbagai 
                                ancaman keamanan siber.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Menu</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/" className="text-gray-300 hover:text-white">Beranda</Link></li>
                                <li><Link href="/profil" className="text-gray-300 hover:text-white">Profil</Link></li>
                                <li><Link href="/layanan" className="text-gray-300 hover:text-white">Layanan</Link></li>
                                <li><Link href="/event" className="text-gray-300 hover:text-white">Event</Link></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
                            <div className="space-y-2 text-sm text-gray-300">
                                <p>Email: csirt_beacukai@kemenkeu.go.id</p>
                                <p>Phone: 1500-225</p>
                                <p>Address: Jl.Jenderal A Yani (By Pass) Rawamangun, Jakarta Timur - 13230</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                        <p className="text-sm text-gray-300">
                            © 2025 CSIRT Bea Cukai. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
