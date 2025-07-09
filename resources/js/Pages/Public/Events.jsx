import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function Events({ upcomingEvents, pastEvents }) {
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

    return (
        <PublicLayout>
            <Head title="Event - CSIRT Bea Cukai" />
            
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Event & Kegiatan</h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                            Berbagai kegiatan, pelatihan, dan workshop yang diselenggarakan oleh CSIRT Bea Cukai
                        </p>
                    </div>
                </div>
            </section>

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Event Mendatang</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Jangan lewatkan event-event menarik yang akan segera berlangsung
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg overflow-hidden border border-blue-200">
                                    {event.image && (
                                        <img 
                                            src={`/storage/${event.image}`} 
                                            alt={event.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-center mb-4">
                                            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold mr-3">
                                                Mendatang
                                            </div>
                                            <span className="text-blue-600 font-semibold">
                                                {formatDate(event.event_date)} • {formatTime(event.event_date)}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                                            {event.title}
                                        </h3>
                                        <p className="text-gray-700 mb-4">
                                            {event.description}
                                        </p>
                                        {event.location && (
                                            <div className="flex items-center text-gray-600 mb-4">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {event.location}
                                            </div>
                                        )}
                                        <Link 
                                            href={`/event/${event.id}`}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Lihat Detail
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Event Sebelumnya</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Dokumentasi kegiatan dan event yang telah berhasil diselenggarakan
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {pastEvents.map((event) => (
                                <article key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                    {event.image && (
                                        <img 
                                            src={`/storage/${event.image}`} 
                                            alt={event.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-center mb-3">
                                            <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
                                                Selesai
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                            {event.title}
                                        </h3>
                                        <p className="text-gray-600 mb-3 line-clamp-2">
                                            {event.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                {formatDate(event.event_date)}
                                            </span>
                                            <Link 
                                                href={`/event/${event.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                                            >
                                                Lihat Detail →
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* No Events Message */}
            {upcomingEvents.length === 0 && pastEvents.length === 0 && (
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Belum Ada Event</h3>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                            Saat ini belum ada event yang dijadwalkan. Pantau terus halaman ini untuk update terbaru.
                        </p>
                        <Link 
                            href="/hubungi-kami"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            Hubungi Kami untuk Info Event
                        </Link>
                    </div>
                </section>
            )}

            {/* Event Types */}
            <section className="py-16 bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Jenis Kegiatan</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Berbagai jenis kegiatan yang rutin diselenggarakan oleh CSIRT Bea Cukai
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Workshop</h3>
                            <p className="text-gray-600 text-sm">Pelatihan teknis keamanan siber</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Seminar</h3>
                            <p className="text-gray-600 text-sm">Edukasi awareness keamanan</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Simulasi</h3>
                            <p className="text-gray-600 text-sm">Latihan response insiden</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Koordinasi</h3>
                            <p className="text-gray-600 text-sm">Meeting antar instansi</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ingin Mengikuti Event Kami?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Daftarkan diri Anda untuk mendapatkan notifikasi event dan kegiatan terbaru dari CSIRT Bea Cukai
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
