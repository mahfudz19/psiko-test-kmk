<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->string('badge_color')->default('bg-blue-100 text-blue-700');
            $table->timestamps();
        });

        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('post_categories')->nullOnDelete();
            $table->string('type')->default('berita'); // berita, webinar, pengumuman
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable();
            $table->string('image')->nullable();
            $table->string('author')->nullable()->default('Tim Gen-U');
            $table->string('read_time')->nullable();
            $table->string('event_date')->nullable();
            $table->string('event_time')->nullable();
            $table->string('event_link')->nullable();
            $table->string('badge_label')->nullable();
            $table->string('status')->default('Aktif (Tampil)');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        $catTips = DB::table('post_categories')->insertGetId([
            'name' => 'Tips Minat Bakat',
            'slug' => 'tips-minat-bakat',
            'badge_color' => 'bg-blue-100 text-blue-700',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $catPmb = DB::table('post_categories')->insertGetId([
            'name' => 'Info PMB',
            'slug' => 'info-pmb',
            'badge_color' => 'bg-indigo-100 text-indigo-700',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $catEksplorasi = DB::table('post_categories')->insertGetId([
            'name' => 'Eksplorasi Studi',
            'slug' => 'eksplorasi-studi',
            'badge_color' => 'bg-amber-100 text-amber-800',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('posts')->insert([
            [
                'category_id' => null,
                'type' => 'webinar',
                'title' => 'Grand Webinar: "Strategi Memilih Jurusan & Menembus Kampus Impian 2027"',
                'slug' => 'grand-webinar-strategi-memilih-jurusan-2027',
                'excerpt' => 'Temukan bedah tuntas bakat minat bersama Praktisi Edukasi & Dosen Farmasi. Dapatkan pula bocoran beasiswa eksklusif Yayasan Gen-U!',
                'content' => '<p>Webinar eksklusif ini dirancang khusus bagi siswa SMA/SMK/MA sederajat dan orang tua yang ingin mempersiapkan kelulusan dan seleksi masuk perguruan tinggi tahun 2027.</p><p>Dalam sesi ini, kita akan mengupas tuntas:</p><ul><li>Cara mengenali potensi sejati melalui kerangka minat bakat psikometri RIASEC.</li><li>Analisis tren kebutuhan karier masa depan di era otomasi dan kecerdasan buatan (AI).</li><li>Strategi memilih prodi saintek, soshum, maupun vokasi yang paling realistis dan minim risiko salah jurusan.</li><li>Informasi dan kiat tembus beasiswa penuh Gen-U dan beasiswa pemerintah.</li></ul><p>Jangan lewatkan kesempatan berharga ini, kuota live Zoom terbatas!</p>',
                'image' => '/landing-bakat-minat.jpg',
                'author' => 'Dr. Hendra Wijaya & Tim Gen-U',
                'read_time' => null,
                'event_date' => 'Sabtu, 24 Oktober 2026',
                'event_time' => '09.00 - 11.30 WITA',
                'event_link' => 'https://gen-u.id/webinar-reg',
                'badge_label' => 'LIVE WEBINAR',
                'status' => 'Aktif (Tampil)',
                'published_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => null,
                'type' => 'pengumuman',
                'title' => 'Beasiswa Prestasi Akademik 2026 Resmi Dibuka!',
                'slug' => 'beasiswa-prestasi-akademik-2026-resmi-dibuka',
                'excerpt' => 'Pendaftaran dibuka hingga 30 November 2026. Kuota terbatas 100 penerima dana pendidikan penuh.',
                'content' => '<p>Yayasan Generasi Universal (Gen-U) resmi membuka pendaftaran Beasiswa Prestasi Akademik tahun 2026. Program beasiswa ini diperuntukkan bagi calon mahasiswa berprestasi yang berkeinginan kuat menempuh studi lanjut.</p><p>Persyaratan mencakup nilai rata-rata rapor semester 1-5 minimal 85.00, surat rekomendasi kepala sekolah, serta sertifikat prestasi penunjang. Segera lengkapi berkas Anda sebelum batas akhir penutupan pendaftaran.</p>',
                'image' => '/landing-beasiswa-1.jpg',
                'author' => 'Sekretariat Beasiswa Gen-U',
                'read_time' => null,
                'event_date' => null,
                'event_time' => null,
                'event_link' => '/beasiswa',
                'badge_label' => 'Baru',
                'status' => 'Aktif (Tampil)',
                'published_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => null,
                'type' => 'pengumuman',
                'title' => 'Modul Simulasi Kuliah Farmasi Telah Diperbarui',
                'slug' => 'modul-simulasi-kuliah-farmasi-telah-diperbarui',
                'excerpt' => 'Coba pengalaman praktikum lab kefarmasian secara virtual gratis di Gen-U.',
                'content' => '<p>Fitur Eksplorasi Program Studi kini dilengkapi dengan materi simulasi modul perkuliahan interaktif Farmasi dan Sains Laboratorium Medis. Siswa dapat melihat gambaran praktikum, formulasi obat, dan tugas perkuliahan secara nyata sebelum mendaftar ke universitas pilihan.</p>',
                'image' => null,
                'author' => 'Tim Pengembang Kurikulum',
                'read_time' => null,
                'event_date' => null,
                'event_time' => null,
                'event_link' => null,
                'badge_label' => 'Fitur',
                'status' => 'Aktif (Tampil)',
                'published_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => $catTips,
                'type' => 'berita',
                'title' => 'Panduan Lengkap Memilih Jurusan Kuliah Sesuai Tipe Kepribadian RIASEC',
                'slug' => 'panduan-lengkap-memilih-jurusan-kuliah-riasec',
                'excerpt' => 'Memilih jurusan bukan sekadar mengikuti tren, melainkan menyelaraskan antara ketertarikan alami, gaya berpikir, dan peluang masa depan.',
                'content' => '<p>Banyak siswa merasa bingung saat harus menentukan pilihan program studi di perguruan tinggi. Teori tipe kepribadian Holland (RIASEC) membagi minat karier menjadi 6 dimensi: Realistic, Investigative, Artistic, Social, Enterprising, dan Conventional.</p><p>Dengan memahami kombinasi tipologi diri, kamu dapat mempersempit pilihan ratusan prodi kuliah menjadi beberapa alternatif yang paling sesuai dengan kepribadian dan potensi sukses jangka panjangmu.</p>',
                'image' => '/landing-bakat-minat.jpg',
                'author' => 'Tim Konseling Gen-U',
                'read_time' => '5 Menit Baca',
                'event_date' => null,
                'event_time' => null,
                'event_link' => null,
                'badge_label' => null,
                'status' => 'Aktif (Tampil)',
                'published_at' => now()->subDays(2),
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'category_id' => $catPmb,
                'type' => 'berita',
                'title' => 'Strategi Mempersiapkan Dokumen & Portofolio Seleksi Masuk Perguruan Tinggi',
                'slug' => 'strategi-mempersiapkan-dokumen-portofolio-seleksi-pmb',
                'excerpt' => 'Langkah taktis menyusun berkas administrasi, esai motivasi, dan sertifikat prestasi agar peluang diterima semakin besar.',
                'content' => '<p>Persaingan masuk perguruan tinggi negeri maupun swasta ternama menuntut kesiapan dokumen yang rapi dan terverifikasi dengan baik. Mulai dari legalisir rapor, portofolio karya seni atau teknologi, hingga esai perkenalan diri.</p><p>Artikel ini merangkum checklist esensial berkas dan bagaimana cara menonjolkan keunggulan portofolio agar reviewer seleksi memberikan nilai lebih pada aplikasi pendaftaranmu.</p>',
                'image' => '/landing-about-campus.jpg',
                'author' => 'Tim Redaksi Gen-U',
                'read_time' => '4 Menit Baca',
                'event_date' => null,
                'event_time' => null,
                'event_link' => null,
                'badge_label' => null,
                'status' => 'Aktif (Tampil)',
                'published_at' => now()->subDays(5),
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'category_id' => $catEksplorasi,
                'type' => 'berita',
                'title' => 'Mengenal Perbedaan Jalur Sarjana (S1), Sarjana Terapan (D4), dan Diploma (D3)',
                'slug' => 'mengenal-perbedaan-jalur-s1-d4-d3',
                'excerpt' => 'Pahami perbedaan bobot teori dan praktik antar jenjang pendidikan agar tidak salah menentukan target kuliah sesuai passionmu.',
                'content' => '<p>Sebelum mendaftar, pastikan kamu memahami perbedaan fundamental antara pendidikan akademis (S1) yang menitikberatkan pada penguasaan teori dan riset, dengan pendidikan vokasi (D3 dan D4) yang berorientasi pada keterampilan teknis terapan dan kesiapan kerja langsung.</p><p>Simak ulasan detail mengenai durasi studi, gelar kelulusan, dan peluang karier masing-masing jalur berikut ini.</p>',
                'image' => '/landing-beasiswa-2.jpg',
                'author' => 'Tim Edukasi Gen-U',
                'read_time' => '6 Menit Baca',
                'event_date' => null,
                'event_time' => null,
                'event_link' => null,
                'badge_label' => null,
                'status' => 'Aktif (Tampil)',
                'published_at' => now()->subDays(10),
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(10),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
        Schema::dropIfExists('post_categories');
    }
};
