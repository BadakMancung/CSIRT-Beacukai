<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Event;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = [
            [
                'title' => 'Workshop Cyber Security Awareness 2025',
                'description' => 'Workshop intensif untuk meningkatkan kesadaran keamanan siber bagi seluruh pegawai Bea Cukai.',
                'content' => 'Workshop ini dirancang khusus untuk memberikan pemahaman mendalam tentang ancaman keamanan siber terkini dan cara mengatasinya.

Materi yang akan dibahas:
- Pengenalan ancaman siber terbaru
- Phishing dan social engineering
- Password security dan 2FA
- Safe browsing practices
- Mobile device security
- Data protection dan privacy
- Incident reporting procedures

Target Peserta:
- Seluruh pegawai Bea Cukai
- Khususnya yang menangani sistem IT
- Management level

Fasilitas:
- Sertifikat kehadiran
- Materi training digital
- Coffee break dan lunch
- Doorprize menarik

Pembicara:
- Tim CSIRT Bea Cukai
- Expert dari BSSN
- Praktisi keamanan siber

Dress Code: Business Casual

Untuk pendaftaran, silakan hubungi tim CSIRT melalui email atau telepon.',
                'location' => 'Auditorium Gedung Djuanda, Jakarta',
                'event_date' => now()->addDays(14)->setHour(9)->setMinute(0),
                'event_end_date' => now()->addDays(14)->setHour(16)->setMinute(0),
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Cyber Security Conference 2025',
                'description' => 'Konferensi tahunan keamanan siber yang menghadirkan expert nasional dan internasional.',
                'content' => 'Konferensi cyber security terbesar di Indonesia yang diselenggarakan oleh CSIRT Bea Cukai bekerja sama dengan berbagai institusi keamanan siber.

Agenda Konferensi:
Day 1 - Strategic Session:
- Opening Ceremony
- Keynote: Future of Cybersecurity
- Panel Discussion: National Cyber Strategy
- Workshop: Threat Intelligence Sharing

Day 2 - Technical Session:
- Advanced Persistent Threats
- AI in Cybersecurity
- Cloud Security Architecture
- DevSecOps Implementation
- Incident Response Best Practices

Pembicara Utama:
- Director of National Cyber Security Agency
- CISO dari perusahaan multinasional
- Researcher dari universitas ternama
- Praktisi cyber security berpengalaman

Target Audience:
- CISO dan security professionals
- IT managers dan administrators
- Government officials
- Academic researchers
- Security vendors

Registration Fee:
- Government: Free
- Private sector: $200
- Students: $50

Benefits:
- 2 hari training intensif
- Networking opportunities
- CPE credits
- Conference proceedings
- Certificate of attendance

Call for Papers juga dibuka untuk research paper dan case study presentation.',
                'location' => 'Jakarta Convention Center',
                'event_date' => now()->addDays(45)->setHour(8)->setMinute(0),
                'event_end_date' => now()->addDays(46)->setHour(17)->setMinute(0),
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Tabletop Exercise: Ransomware Response',
                'description' => 'Simulasi penanganan insiden ransomware untuk menguji kesiapan tim response.',
                'content' => 'Tabletop exercise merupakan simulasi desktop untuk menguji rencana respons insiden dan koordinasi tim dalam menghadapi serangan ransomware.

Tujuan Exercise:
- Menguji incident response plan
- Melatih koordinasi antar tim
- Mengidentifikasi gap dalam prosedur
- Meningkatkan decision making skills
- Membangun muscle memory untuk crisis

Skenario:
Organisasi mengalami serangan ransomware yang mengenkripsi server critical dan meminta tebusan dalam cryptocurrency. Tim harus mengambil keputusan cepat untuk meminimalkan dampak bisnis.

Peserta:
- Incident Response Team
- IT Operations
- Management
- Legal Department
- Communications Team
- External partners (optional)

Metodologi:
- Pre-exercise briefing
- Scenario injection
- Discussion dan decision making
- Time pressure simulation
- After action review

Timeline:
08:00 - Registration & breakfast
09:00 - Opening & scenario briefing
09:30 - Exercise start
12:00 - Lunch break
13:00 - Continue exercise
15:30 - Hot wash discussion
16:30 - Closing & next steps

Deliverables:
- Exercise report
- Lessons learned
- Action items
- Improvement recommendations
- Updated procedures

Prerequisites:
- Familiar dengan incident response procedures
- Basic understanding of ransomware
- Decision making authority

Lokasi dilengkapi dengan:
- War room setup
- Communication systems
- Simulation tools
- Documentation facilities',
                'location' => 'Crisis Management Center, Gedung Djuanda',
                'event_date' => now()->addDays(21)->setHour(8)->setMinute(0),
                'event_end_date' => now()->addDays(21)->setHour(17)->setMinute(0),
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Technical Training: Digital Forensics',
                'description' => 'Pelatihan teknis digital forensics untuk investigasi insiden keamanan siber.',
                'content' => 'Pelatihan intensif digital forensics yang dirancang untuk membekali peserta dengan kemampuan investigasi insiden keamanan siber secara profesional.

Course Outline:
Module 1: Introduction to Digital Forensics
- Forensics methodology
- Legal considerations
- Evidence handling
- Chain of custody

Module 2: File System Forensics
- FAT, NTFS, EXT analysis
- Deleted file recovery
- Timeline analysis
- Metadata examination

Module 3: Memory Forensics
- Memory acquisition
- Process analysis
- Malware detection
- Artifact extraction

Module 4: Network Forensics
- Packet analysis
- Traffic reconstruction
- Protocol investigation
- Log analysis

Module 5: Mobile Forensics
- Android forensics
- iOS investigation
- App data extraction
- Communication analysis

Module 6: Malware Analysis
- Static analysis
- Dynamic analysis
- Reverse engineering basics
- IOC extraction

Tools yang akan digunakan:
- Autopsy
- Volatility
- Wireshark
- YARA
- Ghidra
- Mobile forensics tools

Hands-on Labs:
- Real case study analysis
- Evidence acquisition
- Report writing
- Court testimony preparation

Prerequisites:
- Basic IT knowledge
- Understanding of operating systems
- Network fundamentals
- Command line familiarity

Certification:
Peserta akan mendapatkan certificate of completion dan eligible untuk professional certification exam.

Target Audience:
- Incident response team
- IT security professionals
- Law enforcement
- Legal professionals
- Compliance officers

Duration: 5 hari (40 jam training)
Class size: Maksimal 20 peserta untuk hands-on effectiveness',
                'location' => 'Lab Forensik CSIRT, Gedung Djuanda',
                'event_date' => now()->addDays(60)->setHour(9)->setMinute(0),
                'event_end_date' => now()->addDays(64)->setHour(17)->setMinute(0),
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Cyber Security Summit: Government Sector',
                'description' => 'Summit khusus untuk sektor pemerintahan membahas strategi keamanan siber nasional.',
                'content' => 'Summit eksklusif yang mempertemukan decision makers dari berbagai instansi pemerintah untuk membahas strategi keamanan siber di tingkat nasional.

Strategic Sessions:
1. National Cyber Security Policy Review
2. Inter-agency Coordination Mechanisms
3. Public-Private Partnership in Cybersecurity
4. Critical Infrastructure Protection
5. Cyber Resilience Framework
6. International Cooperation

Key Topics:
- Government cloud security
- Digital transformation security
- Supply chain risk management
- Cyber threat intelligence sharing
- Regulatory compliance
- Budget allocation strategies

Exclusive Roundtables:
- CISO Government Forum
- Policy Makers Discussion
- Technical Working Groups
- Vendor Showcase

Expected Outcomes:
- Strengthened inter-agency collaboration
- Updated security guidelines
- Resource sharing agreements
- Joint training programs
- Coordinated response procedures

VIP Speakers:
- Minister of Communication and IT
- Head of National Cyber Agency
- International cybersecurity experts
- Industry thought leaders

Participation:
By invitation only - limited to government sector representatives with security clearance.

Security Clearance Required: Confidential level minimum

Format:
- Closed-door sessions
- Chatham House rules
- No media coverage
- Confidential proceedings

Networking Opportunities:
- Welcome dinner
- Coffee breaks with structured networking
- Bilateral meetings
- Golf tournament (optional)

Follow-up Actions:
- Working group formation
- MOU signing ceremony
- Joint project initiation
- Quarterly review meetings

This summit is classified as official government business with strict confidentiality requirements.',
                'location' => 'Istana Negara, Jakarta (Restricted Access)',
                'event_date' => now()->addDays(90)->setHour(8)->setMinute(0),
                'event_end_date' => now()->addDays(91)->setHour(18)->setMinute(0),
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Past Events
            [
                'title' => 'Vulnerability Assessment Workshop 2024',
                'description' => 'Workshop praktis tentang metodologi vulnerability assessment untuk infrastruktur IT.',
                'content' => 'Workshop yang telah selesai dilaksanakan dengan sukses, dihadiri oleh 50+ peserta dari berbagai unit kerja di lingkungan Bea Cukai.

Materi yang telah disampaikan:
- Vulnerability assessment methodology
- Scanning tools dan techniques
- Risk assessment dan prioritization
- Remediation planning
- Compliance requirements

Tools yang digunakan:
- Nessus
- OpenVAS
- Nmap
- Metasploit (demo)
- Custom scripts

Hasil Workshop:
- 95% peserta lulus assessment
- 30+ vulnerability ditemukan dan di-remediate
- Standard operating procedure updated
- Follow-up training dijadwalkan

Feedback Peserta:
- 4.8/5 rating overall
- Materi sangat aplikatif
- Instructor berpengalaman
- Lab environment realistic

Next Steps:
- Quarterly vulnerability assessment
- Tool procurement
- Team capability building
- Certification program',
                'location' => 'Training Center Bea Cukai',
                'event_date' => now()->subDays(30)->setHour(9)->setMinute(0),
                'event_end_date' => now()->subDays(30)->setHour(16)->setMinute(0),
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Annual Security Review 2024',
                'description' => 'Review tahunan terhadap postur keamanan siber organisasi dan perencanaan strategi 2025.',
                'content' => 'Annual security review yang telah dilaksanakan dengan melibatkan seluruh stakeholder untuk mengevaluasi pencapaian tahun 2024 dan merencanakan strategi 2025.

Agenda Review:
- Security metrics dashboard presentation
- Incident statistics analysis
- Investment ROI evaluation
- Risk register update
- Compliance status review
- Vendor performance assessment

Key Achievements 2024:
- 40% reduction in security incidents
- 100% compliance dengan regulasi
- Successful SOC implementation
- Zero major data breaches
- 95% staff training completion

Challenges Identified:
- Legacy system vulnerabilities
- Skills gap in emerging technologies
- Budget constraints
- Vendor management complexity
- Remote work security

Strategic Priorities 2025:
- Zero Trust implementation
- AI/ML integration in security
- Cloud security enhancement
- Supply chain security
- Crisis management improvement

Budget Allocation 2025:
- Technology upgrade: 40%
- Training dan certification: 25%
- Consulting services: 20%
- Incident response: 10%
- Compliance: 5%

Action Items:
- Board approval untuk budget 2025
- Vendor selection untuk new tools
- Team restructuring
- Policy updates
- KPI refinement

Stakeholder Commitments:
- Monthly security committee meetings
- Quarterly board reporting
- Semi-annual security assessment
- Annual strategy review',
                'location' => 'Executive Boardroom',
                'event_date' => now()->subDays(60)->setHour(9)->setMinute(0),
                'event_end_date' => now()->subDays(60)->setHour(17)->setMinute(0),
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}
