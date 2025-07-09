import { Head, useForm } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import { useState } from 'react';

export default function Contact() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        incident_type: ''
    });

    const submit = (e) => {
        e.preventDefault();
        // For now, just show success message without actually submitting
        setIsSubmitted(true);
        // In real implementation, you would:
        // post('/contact', {
        //     onSuccess: () => setIsSubmitted(true)
        // });
    };

    if (isSubmitted) {
        return (
            <PublicLayout>
                <Head title="Pesan Terkirim - CSIRT Bea Cukai" />
                <section className="py-20 bg-green-50">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Pesan Berhasil Dikirim!</h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Terima kasih atas pesan Anda. Tim CSIRT Bea Cukai akan segera menghubungi Anda 
                            melalui email atau telepon dalam waktu 24 jam.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={() => setIsSubmitted(false)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Kirim Pesan Lain
                            </button>
                            <a 
                                href="/"
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Kembali ke Beranda
                            </a>
                        </div>
                    </div>
                </section>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title="Hubungi Kami - CSIRT Bea Cukai" />
            
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Hubungi Kami</h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                            Tim CSIRT Bea Cukai siap membantu Anda 24/7 untuk menangani insiden keamanan siber
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>
                            <p className="text-gray-600 mb-8">
                                Sampaikan pertanyaan, laporan insiden, atau permintaan bantuan Anda melalui formulir di bawah ini.
                            </p>
                            
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Nama Lengkap *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Nomor Telepon
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="incident_type" className="block text-sm font-medium text-gray-700 mb-2">
                                            Jenis Insiden
                                        </label>
                                        <select
                                            id="incident_type"
                                            value={data.incident_type}
                                            onChange={(e) => setData('incident_type', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Pilih jenis insiden</option>
                                            <option value="malware">Malware/Virus</option>
                                            <option value="phishing">Phishing/Social Engineering</option>
                                            <option value="unauthorized_access">Akses Tidak Sah</option>
                                            <option value="data_breach">Kebocoran Data</option>
                                            <option value="ddos">DDoS Attack</option>
                                            <option value="vulnerability">Kerentanan Sistem</option>
                                            <option value="other">Lainnya</option>
                                        </select>
                                        {errors.incident_type && <p className="mt-1 text-sm text-red-600">{errors.incident_type}</p>}
                                    </div>
                                </div>
                                
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Subjek *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                                </div>
                                
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Pesan/Deskripsi Insiden *
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={6}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Jelaskan secara detail mengenai insiden atau pertanyaan Anda..."
                                        required
                                    />
                                    {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-colors font-semibold disabled:opacity-50"
                                >
                                    {processing ? 'Mengirim...' : 'Kirim Pesan'}
                                </button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Informasi Kontak</h2>
                            
                            {/* Emergency Contact */}
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                                <div className="flex items-center mb-4">
                                    <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-red-800">Darurat Cyber Security</h3>
                                </div>
                                <p className="text-red-700 mb-4">
                                    Untuk insiden keamanan siber yang urgent dan memerlukan penanganan segera:
                                </p>
                                <div className="space-y-2">
                                    <p className="text-red-800 font-semibold">📞 1500-225</p>
                                    <p className="text-red-800 font-semibold">📧 csirt_beacukai@kemenkeu.go.id</p>
                                </div>
                            </div>

                            {/* Regular Contact */}
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4 mt-1">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                                        <p className="text-gray-600">csirt_beacukai@kemenkeu.go.id</p>
                                        <p className="text-gray-600">pengaduan.beacukai@customs.go.id</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4 mt-1">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Telepon</h3>
                                        <p className="text-gray-600">1500-225</p>
                                        <p className="text-sm text-gray-500 mt-1">Senin - Jumat: 09:00 - 15:00 WIB</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4 mt-1">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Alamat</h3>
                                        <p className="text-gray-600">
                                            Gedung Kalimantan, Lantai 2<br />
                                            Jl. Jenderal Ahmad Yani<br />
                                            By Pass, Rawamangun<br />
                                            Jakarta Timur 13230
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Map */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lokasi</h3>
                                <div className="rounded-lg overflow-hidden shadow-lg">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.433058987642!2d106.87167542499027!3d-6.206468243781333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f48566a071ef%3A0x600f3ad15637ed13!2sDirektorat%20Jenderal%20Bea%20dan%20Cukai%20Kemenkeu%20RI!5e0!3m2!1sid!2sid!4v1752034383529!5m2!1sid!2sid"
                                        width="100%"
                                        height="320"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Lokasi CSIRT Bea Cukai - Jl. Jenderal Ahmad Yani By Pass, Rawamangun, Jakarta Timur"
                                        className="w-full"
                                    ></iframe>
                                </div>
                                <div className="mt-4 text-center">
                                    <a 
                                        href="https://maps.google.com/?q=Direktorat+Jenderal+Bea+dan+Cukai+Jakarta"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Buka di Google Maps
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Pertanyaan Umum</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Jawaban atas pertanyaan yang sering diajukan mengenai layanan CSIRT Bea Cukai
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Kapan saya harus menghubungi CSIRT?
                            </h3>
                            <p className="text-gray-600">
                                Hubungi CSIRT segera jika Anda mengalami atau mencurigai adanya insiden keamanan siber 
                                seperti malware, phishing, akses tidak sah, atau kebocoran data.
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Berapa lama waktu respon CSIRT?
                            </h3>
                            <p className="text-gray-600">
                                Untuk insiden critical: 1 jam, insiden high: 4 jam, dan insiden medium/low: 24 jam. 
                                Layanan darurat tersedia 24/7.
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Apakah layanan CSIRT berbayar?
                            </h3>
                            <p className="text-gray-600">
                                Layanan CSIRT untuk internal Bea Cukai adalah gratis. Untuk instansi eksternal, 
                                dapat berkoordinasi untuk layanan konsultasi dan bantuan teknis.
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Bagaimana cara melaporkan insiden?
                            </h3>
                            <p className="text-gray-600">
                                Insiden dapat dilaporkan melalui email, telepon, atau formulir di website ini. 
                                Untuk insiden urgent, gunakan hotline darurat 24/7.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
