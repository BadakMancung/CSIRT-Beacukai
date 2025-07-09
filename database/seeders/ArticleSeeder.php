<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Article;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $articles = [
            [
                'title' => 'Mengenal Ancaman Phishing dan Cara Mengatasinya',
                'excerpt' => 'Phishing adalah salah satu jenis serangan siber yang paling umum. Pelajari cara mengidentifikasi dan melindungi diri dari ancaman ini.',
                'content' => 'Phishing merupakan bentuk penipuan siber yang menggunakan komunikasi elektronik palsu untuk mencuri informasi sensitif seperti kata sandi, nomor kartu kredit, atau data pribadi lainnya.

Serangan phishing biasanya dilakukan melalui email, pesan teks, atau situs web palsu yang menyamar sebagai entitas terpercaya seperti bank, perusahaan teknologi, atau instansi pemerintah.

Cara Mengidentifikasi Phishing:
1. Periksa alamat email pengirim dengan cermat
2. Waspadai pesan yang meminta informasi pribadi secara mendesak
3. Periksa URL situs web sebelum memasukkan data
4. Perhatikan kesalahan ejaan dan tata bahasa
5. Jangan klik link atau lampiran yang mencurigakan

Langkah Pencegahan:
- Gunakan autentikasi dua faktor
- Perbarui perangkat lunak secara berkala
- Gunakan email filter dan antivirus
- Edukasi diri dan tim tentang tanda-tanda phishing
- Laporkan email phishing ke tim IT atau CSIRT

Jika Anda mengalami serangan phishing, segera hubungi tim CSIRT Bea Cukai untuk mendapatkan bantuan penanganan insiden.',
                'author' => 'Tim CSIRT Bea Cukai',
                'is_published' => true,
                'published_at' => now()->subDays(7),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Best Practices Keamanan Password di Era Digital',
                'excerpt' => 'Password yang kuat adalah garis pertahanan pertama dalam keamanan siber. Ikuti panduan best practices untuk membuat dan mengelola password yang aman.',
                'content' => 'Password merupakan kunci utama dalam melindungi akun dan data digital Anda. Dengan meningkatnya serangan siber, penting untuk memahami cara membuat dan mengelola password yang kuat.

Karakteristik Password yang Kuat:
1. Minimal 12 karakter
2. Kombinasi huruf besar, kecil, angka, dan simbol
3. Tidak menggunakan informasi pribadi
4. Unik untuk setiap akun
5. Tidak menggunakan kata yang ada di kamus

Tips Membuat Password yang Mudah Diingat:
- Gunakan teknik passphrase dengan menggabungkan kata-kata acak
- Buat cerita singkat dan ambil huruf pertama setiap kata
- Gunakan substitusi karakter yang logis

Manajemen Password:
- Gunakan password manager terpercaya
- Aktifkan autentikasi dua faktor (2FA)
- Ganti password secara berkala
- Jangan berbagi password dengan orang lain
- Gunakan password unik untuk akun penting

Password Manager yang Direkomendasikan:
- LastPass
- 1Password
- Bitwarden
- KeePass

Tanda-tanda Password Anda Sudah Dikompromikan:
- Login dari lokasi atau perangkat yang tidak dikenal
- Perubahan pengaturan akun tanpa sepengetahuan Anda
- Email konfirmasi yang tidak Anda minta

Selalu ingat bahwa keamanan password adalah tanggung jawab bersama dalam menjaga keamanan siber organisasi.',
                'author' => 'Specialist Cyber Security',
                'is_published' => true,
                'published_at' => now()->subDays(14),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Ransomware: Ancaman Serius bagi Infrastruktur Kritis',
                'excerpt' => 'Ransomware telah menjadi ancaman utama bagi organisasi di seluruh dunia. Pelajari cara melindungi infrastruktur dari serangan ini.',
                'content' => 'Ransomware adalah jenis malware yang mengenkripsi file dan sistem korban, kemudian meminta tebusan untuk dekripsi. Serangan ini dapat melumpuhkan operasional organisasi dalam hitungan menit.

Bagaimana Ransomware Bekerja:
1. Infiltrasi melalui email phishing, RDP yang tidak aman, atau vulnerability
2. Eskalasi privilege untuk mendapatkan akses administrator
3. Lateral movement untuk menyebar ke sistem lain
4. Enkripsi file dan sistem penting
5. Menampilkan pesan tebusan

Jenis-jenis Ransomware Populer:
- WannaCry
- Ryuk
- Conti
- REvil/Sodinokibi
- LockBit

Strategi Pencegahan:
1. Backup rutin dan offline
2. Patch management yang konsisten
3. Segmentasi jaringan
4. Endpoint Detection and Response (EDR)
5. Email security gateway
6. Pelatihan awareness untuk karyawan

Langkah Mitigasi:
- Isolasi sistem yang terinfeksi
- Identifikasi jenis ransomware
- Cek ketersediaan decryptor gratis
- Restore dari backup yang bersih
- Analisis forensik untuk mencegah kejadian berulang

Respons Insiden Ransomware:
1. Jangan panik dan jangan bayar tebusan
2. Disconnect sistem dari jaringan
3. Dokumentasikan semua evidence
4. Hubungi tim CSIRT dan penegak hukum
5. Komunikasikan dengan stakeholder terkait

Recovery Plan:
- Prioritaskan sistem critical
- Verify integritas backup
- Rebuild sistem dari clean state
- Implement additional security controls
- Conduct lesson learned

Ingat bahwa pencegahan selalu lebih baik daripada pemulihan setelah serangan terjadi.',
                'author' => 'Head of Incident Response',
                'is_published' => true,
                'published_at' => now()->subDays(21),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Zero Trust Architecture: Paradigma Baru Keamanan Siber',
                'excerpt' => 'Zero Trust adalah pendekatan keamanan yang tidak mempercayai siapapun dan apapun secara default. Pelajari implementasinya di organisasi.',
                'content' => 'Zero Trust adalah model keamanan yang beroperasi dengan prinsip "never trust, always verify". Pendekatan ini mengasumsikan bahwa ancaman dapat berasal dari mana saja, baik internal maupun eksternal.

Prinsip Dasar Zero Trust:
1. Verify explicitly - Selalu autentikasi dan autorisasi
2. Use least privileged access - Berikan akses minimal yang dibutuhkan
3. Assume breach - Anggap sistem sudah dikompromikan

Komponen Zero Trust:
- Identity and Access Management (IAM)
- Multi-Factor Authentication (MFA)
- Micro-segmentation
- Encryption everywhere
- Analytics and monitoring
- Automated response

Implementasi Zero Trust:
1. Identifikasi aset dan data sensitif
2. Mapping alur data dan komunikasi
3. Desain micro-perimeter
4. Implementasi kontrol akses granular
5. Monitor dan analisis kontinyu

Manfaat Zero Trust:
- Reduced attack surface
- Improved visibility
- Better compliance
- Enhanced data protection
- Minimized lateral movement

Challenges dalam Implementasi:
- Kompleksitas arsitektur
- Cultural change management
- Legacy system integration
- Cost considerations
- Skills requirement

Best Practices:
- Start with most critical assets
- Implement gradually
- Train security team
- Regular assessment and improvement
- Vendor evaluation

Zero Trust bukan teknologi tunggal, tetapi framework komprehensif yang memerlukan pendekatan holistik dalam implementasinya.',
                'author' => 'Security Architect',
                'is_published' => true,
                'published_at' => now()->subDays(28),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Incident Response Plan: Kesiapan Menghadapi Serangan Siber',
                'excerpt' => 'Rencana respons insiden yang baik dapat meminimalkan dampak serangan siber. Pelajari komponen penting dalam incident response plan.',
                'content' => 'Incident Response Plan adalah dokumentasi terstruktur yang berisi prosedur dan langkah-langkah yang harus diambil ketika terjadi insiden keamanan siber.

Fase Incident Response:
1. Preparation - Persiapan tim, tools, dan prosedur
2. Identification - Deteksi dan klasifikasi insiden
3. Containment - Isolasi dan pembatasan dampak
4. Eradication - Eliminasi akar penyebab
5. Recovery - Pemulihan operasional normal
6. Lessons Learned - Evaluasi dan perbaikan

Tim Incident Response:
- Incident Commander
- Security Analyst
- Network Administrator
- Legal Counsel
- Communications Lead
- Management Representative

Preparation Phase:
- Establish incident response team
- Develop policies and procedures
- Deploy monitoring tools
- Create communication templates
- Conduct tabletop exercises
- Maintain updated contact list

Detection and Analysis:
- SIEM monitoring
- User reports
- Threat intelligence
- Automated alerts
- Log analysis
- Network monitoring

Classification Criteria:
- Low: Minimal impact, single system
- Medium: Multiple systems, some business impact
- High: Critical systems, significant business impact
- Critical: Major outage, data breach, public safety

Containment Strategies:
- Short-term: Immediate threat mitigation
- Long-term: Temporary fixes
- System isolation
- Network segmentation
- Account disabling
- Traffic blocking

Communication Plan:
- Internal stakeholders
- External partners
- Law enforcement
- Regulatory bodies
- Media (if necessary)
- Customers (if applicable)

Documentation Requirements:
- Timeline of events
- Actions taken
- Evidence collected
- Impact assessment
- Cost calculation
- Lessons learned

Recovery Validation:
- System integrity check
- Vulnerability assessment
- Monitoring enhancement
- Security controls verification
- Business process validation

Post-Incident Activities:
- Formal report creation
- Process improvement
- Training updates
- Tool enhancement
- Policy revision

Metrics and KPIs:
- Time to detection
- Time to containment
- Time to recovery
- Number of incidents
- Cost per incident
- Customer impact

Regular testing dan updating incident response plan sangat penting untuk memastikan efektivitasnya saat insiden sebenarnya terjadi.',
                'author' => 'Incident Response Manager',
                'is_published' => true,
                'published_at' => now()->subDays(35),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($articles as $article) {
            Article::create($article);
        }
    }
}
