import { Head } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import PartnershipLogo from '../../Components/PartnershipLogo';

export default function About() {
    const seoData = {
        description: "Profil CSIRT Bea Cukai - Computer Security Incident Response Team Direktorat Jenderal Bea dan Cukai. Visi, misi, struktur tim, dan kerjasama dalam keamanan siber Indonesia.",
        keywords: "Profil CSIRT Bea Cukai, Tentang CSIRT Bea Cukai, Tim Keamanan Siber Bea Cukai, Visi Misi CSIRT, Government CSIRT Indonesia, Kemenkeu CSIRT",
        url: "/profil",
        type: "website"
    };

    return (
        <PublicLayout 
            title="Profil CSIRT Bea Cukai | Computer Security Incident Response Team"
            seoData={seoData}
        >
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Profil CSIRT Bea Cukai</h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                            Mengenal lebih dalam tentang Computer Security Incident Response Team 
                            Direktorat Jenderal Bea dan Cukai
                        </p>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Tentang CSIRT Bea Cukai</h2>
                            <div className="prose prose-lg text-gray-600">
                                <p className="mb-4">
                                    Computer Security Incident Response Team (CSIRT) Bea Cukai adalah unit khusus 
                                    yang bertugas untuk melindungi infrastruktur teknologi informasi Direktorat 
                                    Jenderal Bea dan Cukai dari berbagai ancaman keamanan siber.
                                </p>
                                <p className="mb-4">
                                    Dibentuk untuk mengantisipasi dan merespon insiden keamanan siber yang dapat 
                                    mengancam sistem informasi dan data penting dalam operasional kepabeanan dan cukai.
                                </p>
                                <p>
                                    Tim kami terdiri dari para ahli keamanan siber yang berpengalaman dan terlatih 
                                    untuk menangani berbagai jenis ancaman dan insiden keamanan.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-blue-100 rounded-lg p-8">
                                <svg className="w-full h-64 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision Mission Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Vision */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <div className="flex items-center mb-6">
                                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Visi</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                Visi CSIRT Bea Cukai adalah terwujudnya pengelolaan keamanan informasi di lingkungan Direktorat Jenderal Bea dan Cukai sesuai dengan prinsip keamanan informasi yaitu untuk menjamin ketersediaan (availability), keutuhan (integrity), dan kerahasiaan (confidentiality) Aset Informasi Direktorat Jenderal Bea dan Cukai.
                            </p>
                        </div>

                        {/* Mission */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <div className="flex items-center mb-6">
                                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Misi</h3>
                            </div>
                            <ul className="text-gray-700 leading-relaxed space-y-3">
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2 mt-1">•</span>
                                    Melakukan monitoring dan deteksi ancaman keamanan siber secara real-time
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2 mt-1">•</span>
                                    Merespon dan menangani insiden keamanan siber dengan cepat dan efektif
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2 mt-1">•</span>
                                    Memberikan edukasi dan pelatihan keamanan siber kepada pegawai
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2 mt-1">•</span>
                                    Mengembangkan kebijakan dan prosedur keamanan siber yang komprehensif
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2 mt-1">•</span>
                                    Berkolaborasi dengan instansi terkait dalam penanganan ancaman siber
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partnership Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Kerjasama & Kemitraan</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            CSIRT Bea Cukai berkolaborasi dengan berbagai instansi untuk memperkuat keamanan siber nasional
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Gov CSIRT */}
                        <PartnershipLogo
                            src="/images/govcsirt.png"
                            alt="Logo Government CSIRT Indonesia"
                            title="Government CSIRT Indonesia"
                            description="Berkolaborasi dengan CSIRT pemerintah untuk koordinasi penanganan insiden keamanan siber tingkat nasional dan sharing threat intelligence."
                            size="large"
                        />
                        
                        {/* Kemenkeu CSIRT */}
                        <PartnershipLogo
                            src="/images/kemenkeu_csirt.png"
                            alt="Logo Kemenkeu CSIRT"
                            title="Kemenkeu CSIRT"
                            description="Bagian dari ekosistem keamanan siber Kementerian Keuangan yang terintegrasi untuk melindungi seluruh infrastruktur TI di lingkungan Kemenkeu."
                            size="large"
                        />
                    </div>
                </div>
            </section>

            {/* Team Structure */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Struktur Tim</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Tim CSIRT Bea Cukai terdiri dari berbagai divisi yang bekerja sama untuk 
                            menjaga keamanan siber
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Incident Response</h3>
                            <p className="text-gray-600 text-sm">Menangani dan merespon insiden keamanan siber</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Threat Intelligence</h3>
                            <p className="text-gray-600 text-sm">Menganalisis dan mengidentifikasi ancaman baru</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Vulnerability Assessment</h3>
                            <p className="text-gray-600 text-sm">Melakukan assessment kerentanan sistem</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Education & Training</h3>
                            <p className="text-gray-600 text-sm">Memberikan edukasi keamanan siber</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-16 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ingin Tahu Lebih Lanjut?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Hubungi tim CSIRT Bea Cukai untuk informasi lebih detail tentang layanan kami
                    </p>
                    <a 
                        href="/hubungi-kami"
                        className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100 transition-colors"
                    >
                        Hubungi Kami
                    </a>
                </div>
            </section>
        </PublicLayout>
    );
}
