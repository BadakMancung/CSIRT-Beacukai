import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function EventShow({ event }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isUpcoming = new Date(event.event_date) > new Date();

    return (
        <PublicLayout>
            <Head title={`${event.title} - CSIRT Bea Cukai`} />
            
            {/* Breadcrumb */}
            <section className="bg-gray-50 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600">Beranda</Link>
                        <span className="mx-2">/</span>
                        <Link href="/event" className="hover:text-blue-600">Event</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 truncate">{event.title}</span>
                    </nav>
                </div>
            </section>

            {/* Event Header */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <header className="mb-8">
                        {/* Status Badge */}
                        <div className="mb-6">
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                                isUpcoming 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {isUpcoming ? (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Event Mendatang
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Event Selesai
                                    </>
                                )}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            {event.title}
                        </h1>

                        {event.image && (
                            <img 
                                src={event.image_url || `/storage/${event.image}`} 
                                alt={event.title}
                                className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg mb-8"
                            />
                        )}

                        {/* Event Meta */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-semibold text-gray-900">Tanggal</span>
                                </div>
                                <p className="text-gray-700">
                                    {formatDate(event.event_date)}
                                    {event.event_end_date && event.event_end_date !== event.event_date && (
                                        <> - {formatDate(event.event_end_date)}</>
                                    )}
                                </p>
                            </div>

                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-semibold text-gray-900">Waktu</span>
                                </div>
                                <p className="text-gray-700">
                                    {formatTime(event.event_date)} WIB
                                    {event.event_end_date && (
                                        <> - {formatTime(event.event_end_date)} WIB</>
                                    )}
                                </p>
                            </div>

                            {event.location && (
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="font-semibold text-gray-900">Lokasi</span>
                                    </div>
                                    <p className="text-gray-700">{event.location}</p>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="text-xl text-gray-700 leading-relaxed mb-8 p-6 bg-gray-50 rounded-xl">
                            {event.description}
                        </div>
                    </header>

                    {/* Event Content */}
                    <div className="prose prose-lg max-w-none mb-12">
                        <div 
                            className="text-gray-800 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: event.content.replace(/\n/g, '<br />') }}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t border-gray-200 pt-8">
                        {isUpcoming ? (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Event ini akan segera berlangsung
                                </h3>
                                <p className="text-green-700 mb-4">
                                    Untuk informasi lebih lanjut atau pendaftaran, silakan hubungi tim CSIRT Bea Cukai.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link 
                                        href="/hubungi-kami"
                                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                                    >
                                        Hubungi untuk Info
                                    </Link>
                                    <a 
                                        href="mailto:csirt@beacukai.go.id?subject=Pendaftaran Event: {event.title}"
                                        className="inline-flex items-center justify-center px-6 py-3 border border-green-600 text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 transition-colors"
                                    >
                                        Email Langsung
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Event ini telah selesai
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    Terima kasih kepada semua peserta yang telah mengikuti event ini. 
                                    Pantau terus website kami untuk event mendatang.
                                </p>
                                <Link 
                                    href="/event"
                                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                >
                                    Lihat Event Lainnya
                                </Link>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between items-center mt-8">
                            <Link 
                                href="/event"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                ← Kembali ke Event
                            </Link>
                            
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-600">Bagikan event:</span>
                                <div className="flex space-x-3">
                                    <a 
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(event.title)}&url=${encodeURIComponent(window.location.href)}`}
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
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-16 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Tertarik dengan Event Kami?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Daftarkan diri Anda untuk mendapatkan notifikasi event dan kegiatan terbaru dari CSIRT Bea Cukai
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            href="/hubungi-kami"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100 transition-colors"
                        >
                            Hubungi Kami
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
