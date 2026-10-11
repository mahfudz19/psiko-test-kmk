<?php

namespace Database\Seeders;

use App\Models\Major;
use Illuminate\Database\Seeder;

class MajorSeeder extends Seeder
{
    public function run(): void
    {
        $majors = [
            [
                'code' => 'd3-farmasi',
                'group' => 'kesehatan',
                'jenjang' => 'D3',
                'title' => 'D3 Farmasi',
                'teaser' => 'Belajar dasar-dasar meracik obat, pelayanan farmasi, dan teknik laboratorium dasar.',
                'description' => 'Program Diploma 3 Farmasi fokus pada penciptaan Tenaga Teknis Kefarmasian (TTK) yang terampil. Kamu akan banyak menghabiskan waktu di laboratorium, mempelajari cara membuat sediaan obat yang tepat dan aman.',
                'study_activities' => [
                    'Praktikum resep obat dan sediaan farmasi (tablet, sirup, salep).',
                    'Simulasi pelayanan di apotek dan instalasi farmasi rumah sakit.',
                    'Mempelajari bahan alam untuk pengobatan tradisional.',
                ],
                'career_prospects' => [
                    'Asisten Apoteker di Apotek, Klinik, atau Rumah Sakit.',
                    'Teknisi di industri farmasi dan kosmetik.',
                    'Staf QC (Quality Control) di pabrik obat.',
                ],
            ],
            [
                'code' => 's1-farmasi',
                'group' => 'kesehatan',
                'jenjang' => 'S1',
                'title' => 'S1 Farmasi',
                'teaser' => 'Mendalami ilmu kimia medisinal, farmakologi, dan desain sediaan obat yang lebih kompleks.',
                'description' => 'S1 Farmasi mempelajari ilmu kefarmasian secara mendalam, tidak hanya meracik tapi juga menganalisis dan mendesain obat. Lulusan sarjana (S.Farm) dibekali pemahaman sains yang kuat sebagai pondasi menjadi ahli farmasi atau peneliti.',
                'study_activities' => [
                    'Mempelajari nasib obat dalam tubuh (Farmakokinetika).',
                    'Uji efektivitas dan keamanan obat (Farmakologi & Toksikologi).',
                    'Manajemen farmasi klinis dan kesehatan masyarakat.',
                    'Riset mandiri melalui penyusunan skripsi.',
                ],
                'career_prospects' => [
                    'Research & Development (R&D) di industri farmasi.',
                    'Regulator di BPOM atau instansi kesehatan.',
                    '*Syarat wajib untuk lanjut mengambil Program Profesi Apoteker.',
                ],
            ],
            [
                'code' => 'profesi-apoteker',
                'group' => 'kesehatan',
                'jenjang' => 'PROFESI',
                'title' => 'Profesi Apoteker',
                'teaser' => 'Program lanjutan wajib untuk mendapatkan izin praktik (SIPA) sebagai penanggung jawab.',
                'description' => 'Program Profesi Apoteker (Apt.) adalah pendidikan pascasarjana singkat (sekitar 1 tahun) yang wajib diambil lulusan S1 Farmasi jika ingin memiliki kewenangan penuh sebagai Apoteker Praktik.',
                'study_activities' => [
                    'Kuliah Kerja Praktik (PKPA) langsung di Apotek, Rumah Sakit, dan Industri.',
                    'Simulasi kasus klinis pasien nyata.',
                    'Ujian Kompetensi Apoteker Indonesia (UKAI).',
                ],
                'career_prospects' => [
                    'Apoteker Penanggung Jawab Apotek (APA).',
                    'Apoteker Klinis di Rumah Sakit.',
                    'Manajer Produksi/QC/QA di Industri Farmasi.',
                ],
            ],
            [
                'code' => 'd3-kebidanan',
                'group' => 'kesehatan',
                'jenjang' => 'D3',
                'title' => 'D3 Kebidanan',
                'teaser' => 'Fokus pada keterampilan praktis menolong persalinan normal dan asuhan kebidanan esensial.',
                'description' => 'D3 Kebidanan mencetak bidan pelaksana yang sangat terampil secara teknis. Fokusnya adalah pada tindakan klinis asuhan kehamilan, persalinan normal, nifas, dan perawatan bayi baru lahir.',
                'study_activities' => [
                    'Praktikum skill lab menolong persalinan (dengan manekin/phantom).',
                    'Praktik klinik langsung di Bidan Praktik Mandiri (BPM) atau Puskesmas.',
                    'Mata kuliah anatomi, fisiologi reproduksi, dan KIA.',
                ],
                'career_prospects' => [
                    'Bidan Pelaksana di Rumah Sakit, Puskesmas, atau Klinik Bersalin.',
                    'Asisten bidan senior di Bidan Praktik Mandiri.',
                ],
            ],
            [
                'code' => 's1-kebidanan',
                'group' => 'kesehatan',
                'jenjang' => 'S1',
                'title' => 'S1 Kebidanan',
                'teaser' => 'Mempelajari asuhan kebidanan yang berbasis bukti (evidence-based) dan penanganan komplikasi awal.',
                'description' => 'S1 Kebidanan (S.Keb) membekali mahasiswa dengan kemampuan analitis, pemahaman komplikasi kebidanan, serta pendekatan asuhan berbasis bukti ilmiah. S1 merupakan syarat dasar untuk lanjut profesi bidan.',
                'study_activities' => [
                    'Pendalaman asuhan kebidanan komprehensif.',
                    'Deteksi dini komplikasi pada kehamilan dan persalinan.',
                    'Riset dan penyusunan skripsi terkait kesehatan ibu dan anak.',
                ],
                'career_prospects' => [
                    'Pendidik/Instruktur klinis kebidanan (dengan pendidikan tambahan).',
                    'Peneliti kesehatan ibu dan anak.',
                    '*Syarat wajib untuk lanjut mengambil Program Profesi Bidan.',
                ],
            ],
            [
                'code' => 'profesi-bidan',
                'group' => 'kesehatan',
                'jenjang' => 'PROFESI',
                'title' => 'Profesi Bidan',
                'teaser' => 'Syarat mutlak untuk membuka Bidan Praktik Mandiri (BPM) dan memberikan asuhan secara mandiri.',
                'description' => 'Program Profesi Bidan (Bd.) memberikan kewenangan legal penuh kepada lulusan S1 Kebidanan untuk melakukan praktik kebidanan mandiri. Mahasiswa akan dilepas untuk menangani kasus nyata di bawah supervisi.',
                'study_activities' => [
                    'Rotasi stase praktik klinik di Rumah Sakit rujukan dan Puskesmas.',
                    'Stase komunitas (terjun langsung ke desa/masyarakat).',
                    'Ujian Kompetensi Bidan (UKB).',
                ],
                'career_prospects' => [
                    'Membuka Bidan Praktik Mandiri (BPM) atau Klinik Bersalin.',
                    'Bidan Penanggung Jawab di fasilitas layanan kesehatan.',
                    'Koordinator KIA di Dinas Kesehatan.',
                ],
            ],
            [
                'code' => 's1-manajemen',
                'group' => 'tech',
                'jenjang' => 'S1',
                'title' => 'S1 Manajemen',
                'teaser' => 'Ilmu tentang bagaimana merencanakan, mengorganisasi, dan memimpin perusahaan mencapai tujuan bisnis.',
                'description' => 'Program studi Manajemen mengajarkan seni dan ilmu dalam mengelola sumber daya—baik manusia, keuangan, maupun operasional—untuk mencapai tujuan organisasi/perusahaan secara efektif dan efisien.',
                'study_activities' => [
                    'Studi kasus perusahaan nyata, dari startup hingga multinasional.',
                    'Simulasi bisnis dan strategi pemasaran.',
                    'Mempelajari analisis keuangan dan investasi dasar.',
                ],
                'career_prospects' => [
                    'Manajer Operasional atau Pemasaran (Marketing).',
                    'Human Resources (HR) Officer.',
                    'Wirausahawan (Entrepreneur) / Business Owner.',
                ],
            ],
            [
                'code' => 's1-akuntansi',
                'group' => 'tech',
                'jenjang' => 'S1',
                'title' => 'S1 Akuntansi',
                'teaser' => 'Bahasa bisnis. Belajar mencatat, melaporkan, dan menganalisis kondisi keuangan suatu entitas.',
                'description' => 'Akuntansi adalah tulang punggung setiap organisasi. Jurusan ini melatih ketelitian dalam mengelola laporan keuangan, audit, serta perpajakan sesuai standar akuntansi yang berlaku.',
                'study_activities' => [
                    'Praktikum menyusun laporan keuangan (Jurnal, Buku Besar, Neraca).',
                    'Belajar aplikasi software akuntansi dan ERP.',
                    'Mempelajari hukum pajak dan teknik audit laporan.',
                ],
                'career_prospects' => [
                    'Auditor di Kantor Akuntan Publik (KAP).',
                    'Konsultan Pajak atau Analis Keuangan.',
                    'Akuntan Perusahaan (Corporate Accountant).',
                ],
            ],
            [
                'code' => 's1-hukum',
                'group' => 'tech',
                'jenjang' => 'S1',
                'title' => 'S1 Hukum Bisnis',
                'teaser' => 'Memahami perundang-undangan dan instrumen legal yang mengatur jalannya bisnis dan korporasi.',
                'description' => 'Hukum Bisnis (Corporate Law) berfokus pada regulasi perdagangan, kontrak bisnis, hak kekayaan intelektual (HKI), hingga penyelesaian sengketa perusahaan. Menggabungkan nalar hukum dan insting bisnis.',
                'study_activities' => [
                    'Analisis kasus kontrak bisnis dan sengketa perdata.',
                    'Simulasi peradilan (Moot Court) kasus komersial.',
                    'Drafting dokumen legal (perjanjian kerja, akta perusahaan).',
                ],
                'career_prospects' => [
                    'Legal Officer / In-house Counsel perusahaan.',
                    'Konsultan Hukum Kekayaan Intelektual.',
                    'Pengacara Bisnis (dengan syarat lanjut PKPA).',
                ],
            ],
            [
                'code' => 's1-if',
                'group' => 'tech',
                'jenjang' => 'S1',
                'title' => 'S1 Informatika',
                'teaser' => 'Mempelajari komputasi murni, algoritma kompleks, dan rekayasa perangkat lunak (Software Engineering).',
                'description' => 'Teknik Informatika (Computer Science) mendalami bagaimana komputer memproses data. Jurusan ini sangat teknis, sarat dengan logika matematika, coding, dan penciptaan algoritma untuk memecahkan masalah.',
                'study_activities' => [
                    'Menulis kode program (coding) menggunakan berbagai bahasa (Python, Java, C++).',
                    'Membangun aplikasi mobile, web, hingga kecerdasan buatan (AI).',
                    'Mempelajari struktur data dan keamanan siber.',
                ],
                'career_prospects' => [
                    'Software Engineer / Web & Mobile Developer.',
                    'Machine Learning / AI Engineer.',
                    'Cybersecurity Analyst.',
                ],
            ],
            [
                'code' => 's1-si',
                'group' => 'tech',
                'jenjang' => 'S1',
                'title' => 'S1 Sistem Informasi',
                'teaser' => 'Jembatan antara teknologi IT dan kebutuhan bisnis. Fokus pada perancangan sistem berbasis data.',
                'description' => 'Sistem Informasi menggabungkan ilmu komputer dengan manajemen bisnis. Lulusannya bertugas menerjemahkan apa yang dibutuhkan perusahaan menjadi sistem aplikasi yang efisien.',
                'study_activities' => [
                    'Analisis proses bisnis perusahaan.',
                    'Merancang basis data (Database Design) dan arsitektur sistem.',
                    'Belajar UI/UX Design dan Manajemen Proyek IT.',
                ],
                'career_prospects' => [
                    'System Analyst atau Business Analyst.',
                    'IT Project Manager.',
                    'UI/UX Researcher & Designer.',
                ],
            ],
            [
                'code' => 's1-komunikasi',
                'group' => 'tech',
                'jenjang' => 'S1',
                'title' => 'S1 Ilmu Komunikasi',
                'teaser' => 'Seni menyampaikan pesan secara efektif melalui media massa, digital, dan relasi publik.',
                'description' => 'Ilmu Komunikasi mempelajari bagaimana pesan diproduksi, disebarkan, dan diterima. Berfokus pada dinamika media modern, jurnalistik, hingga strategi membangun citra positif perusahaan (Public Relations).',
                'study_activities' => [
                    'Praktikum penulisan naskah (copywriting), rilis berita, dan artikel.',
                    'Simulasi public speaking dan negosiasi.',
                    'Produksi konten kreatif (podcast, video, kampanye media sosial).',
                ],
                'career_prospects' => [
                    'Public Relations (PR) / Hubungan Masyarakat.',
                    'Digital Content Creator / Social Media Specialist.',
                    'Jurnalis atau Broadcaster.',
                ],
            ],
        ];

        foreach ($majors as $m) {
            Major::updateOrCreate(['code' => $m['code']], $m);
        }
    }
}
