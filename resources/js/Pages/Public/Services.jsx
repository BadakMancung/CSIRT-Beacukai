import { Head } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function Services() {
    const services = [
        {
            title: "Incident Response",
            description: "Respon cepat dan efektif terhadap insiden keamanan siber yang terjadi pada infrastruktur TI Bea Cukai",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            features: [
                "24/7 Monitoring dan Detection",
                "Rapid Response Team",
                "Forensik Digital",
                "Recovery Planning"
            ]
        },
        {
            title: "Vulnerability Assessment",
            description: "Penilaian kerentanan sistem secara berkala untuk mengidentifikasi dan mengatasi celah keamanan",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
            ),
            features: [
                "Network Security Assessment",
                "Web Application Testing",
                "Infrastructure Audit",
                "Remediation Planning"
            ]
        },
        {
            title: "Threat Intelligence",
            description: "Analisis dan monitoring ancaman keamanan siber terkini untuk antisipasi dini",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            features: [
                "Real-time Threat Monitoring",
                "Malware Analysis",
                "IOC Management",
                "Threat Briefings"
            ]
        },
        {
            title: "Security Training",
            description: "Program pelatihan dan edukasi keamanan siber untuk pegawai Bea Cukai",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            features: [
                "Cybersecurity Awareness",
                "Phishing Simulation",
                "Technical Training",
                "Best Practices Workshop"
            ]
        },
        {
            title: "Policy Development",
            description: "Pengembangan kebijakan dan prosedur keamanan siber yang komprehensif",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            features: [
                "Security Policy Framework",
                "Compliance Guidelines",
                "Risk Assessment",
                "Governance Structure"
            ]
        },
        {
            title: "Collaboration & Coordination",
            description: "Koordinasi dengan instansi terkait dalam penanganan insiden keamanan nasional",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            features: [
                "Inter-agency Cooperation",
                "Information Sharing",
                "Joint Operations",
                "National Cyber Defense"
            ]
        }
    ];

    return (
        <PublicLayout>
            <Head title="Layanan - CSIRT Bea Cukai" />
            
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Layanan CSIRT Bea Cukai</h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                            Layanan komprehensif untuk melindungi infrastruktur teknologi informasi 
                            dari berbagai ancaman keamanan siber
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Overview */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Layanan Unggulan Kami</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            CSIRT Bea Cukai menyediakan berbagai layanan keamanan siber yang dirancang 
                            untuk melindungi aset digital dan informasi penting
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-6">
                                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 mr-4">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                                </div>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {service.description}
                                </p>
                                <ul className="space-y-2">
                                    {service.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                                            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Service Process */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Proses Layanan</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Tahapan sistematis dalam penanganan insiden dan penyediaan layanan keamanan siber
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-600">1</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Detection</h3>
                            <p className="text-gray-600 text-sm">Deteksi dini ancaman dan anomali sistem</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-green-600">2</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis</h3>
                            <p className="text-gray-600 text-sm">Analisis mendalam terhadap insiden yang terjadi</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-orange-600">3</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Response</h3>
                            <p className="text-gray-600 text-sm">Respon cepat dan koordinasi penanganan</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-purple-600">4</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recovery</h3>
                            <p className="text-gray-600 text-sm">Pemulihan sistem dan pencegahan berulang</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SLA Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Level Agreement</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Komitmen waktu respon untuk berbagai tingkat prioritas insiden
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                            <div className="text-center">
                                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-red-800 mb-2">Critical</h3>
                                <p className="text-3xl font-bold text-red-600 mb-2">1 Jam</p>
                                <p className="text-red-700 text-sm">
                                    Insiden yang mengancam operasional utama atau keamanan data sensitif
                                </p>
                            </div>
                        </div>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                            <div className="text-center">
                                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-yellow-800 mb-2">High</h3>
                                <p className="text-3xl font-bold text-yellow-600 mb-2">4 Jam</p>
                                <p className="text-yellow-700 text-sm">
                                    Insiden yang mempengaruhi layanan penting namun tidak critical
                                </p>
                            </div>
                        </div>
                        
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                            <div className="text-center">
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-green-800 mb-2">Medium/Low</h3>
                                <p className="text-3xl font-bold text-green-600 mb-2">24 Jam</p>
                                <p className="text-green-700 text-sm">
                                    Insiden dengan dampak terbatas dan dapat ditangani terjadwal
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-16 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Butuh Layanan CSIRT?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Hubungi tim CSIRT Bea Cukai untuk konsultasi atau bantuan penanganan insiden keamanan siber
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href="/hubungi-kami"
                            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100 transition-colors"
                        >
                            Hubungi Kami
                        </a>
                        <a 
                            href="mailto:csirt@beacukai.go.id"
                            className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            Email Langsung
                        </a>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
