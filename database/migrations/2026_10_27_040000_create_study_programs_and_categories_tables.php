<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('study_program_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('study_programs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('study_program_categories')->nullOnDelete();
            $table->string('name');
            $table->string('status')->default('Aktif (Tampil)');
            $table->string('icon')->nullable();
            $table->string('academic_degree')->nullable();
            $table->text('short_description')->nullable();
            $table->longText('detailed_description')->nullable();
            $table->json('career_prospects')->nullable();
            $table->timestamps();
        });

        $catSaintekId = DB::table('study_program_categories')->insertGetId([
            'name' => 'Sains & Teknologi (Saintek)',
            'description' => 'Mencakup rumpun ilmu MIPA, Teknik, Teknologi, dan Rekayasa.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $catSoshumId = DB::table('study_program_categories')->insertGetId([
            'name' => 'Sosial & Humaniora (Soshum)',
            'description' => 'Mencakup rumpun ilmu sosial, ekonomi, komunikasi, dan humaniora.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $catKesehatanId = DB::table('study_program_categories')->insertGetId([
            'name' => 'Kesehatan & Kedokteran',
            'description' => 'Mencakup rumpun ilmu kedokteran, farmasi, keperawatan, dan kesehatan masyarakat.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('study_program_categories')->insert([
            'name' => 'Vokasi / Terapan',
            'description' => 'Mencakup rumpun pendidikan terapan (diploma dan sarjana terapan).',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('study_programs')->insert([
            [
                'category_id' => $catSaintekId,
                'name' => 'Teknik Informatika',
                'status' => 'Aktif (Tampil)',
                'icon' => null,
                'academic_degree' => 'S.Kom. (Sarjana Komputer)',
                'short_description' => 'Mempelajari komputasi, arsitektur perangkat lunak, AI, dan sistem komputasi modern.',
                'detailed_description' => '<p>S1 Teknik Informatika berfokus pada logika komputasi, arsitektur perangkat lunak modern, kecerdasan buatan (AI & machine learning), komputasi awan, serta keamanan siber untuk memecahkan berbagai tantangan digital masa depan.</p>',
                'career_prospects' => json_encode([
                    ['name' => 'Software Engineer', 'description' => 'Mengembangkan perangkat lunak dan arsitektur aplikasi skala besar.'],
                    ['name' => 'Data Scientist', 'description' => 'Mengolah dan menganalisis big data dengan kecerdasan buatan.'],
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => $catSoshumId,
                'name' => 'Ilmu Komunikasi',
                'status' => 'Aktif (Tampil)',
                'icon' => null,
                'academic_degree' => 'S.I.Kom. (Sarjana Ilmu Komunikasi)',
                'short_description' => 'Mempelajari produksi dan strategi komunikasi, media digital, serta relasi publik.',
                'detailed_description' => '<p>Ilmu Komunikasi mempelajari bagaimana pesan diproduksi, disampaikan, dan diterima melalui berbagai saluran media konvensional maupun digital.</p>',
                'career_prospects' => json_encode([
                    ['name' => 'Public Relations', 'description' => 'Membangun reputasi positif dan strategi komunikasi korporat.'],
                    ['name' => 'Jurnalis Media', 'description' => 'Meliput, menyusun, dan memproduksi informasi berita terpercaya.'],
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => $catKesehatanId,
                'name' => 'S1 Farmasi',
                'status' => 'Aktif (Tampil)',
                'icon' => null,
                'academic_degree' => 'S.Farm. (Sarjana Farmasi)',
                'short_description' => 'Pelajari seluk beluk obat-obatan, pengembangan formula, hingga analisis interaksi obat untuk penyembuhan.',
                'detailed_description' => '<p>S1 Farmasi adalah program studi yang mempelajari segala hal tentang obat-obatan. Kamu akan belajar mulai dari pencarian bahan baku (alam maupun sintetis), pengembangan formula, cara memproduksi obat yang aman, hingga menganalisis interaksi dan efek klinis obat di dalam tubuh manusia untuk menyembuhkan penyakit.</p>',
                'career_prospects' => json_encode([
                    ['name' => 'Fasilitas Kesehatan', 'description' => 'Menjadi Apoteker klinis di Rumah Sakit, Klinik, Puskesmas, atau Apotek Komunitas.'],
                    ['name' => 'Industri Farmasi', 'description' => 'Bekerja di industri obat, kosmetik, atau makanan pada bagian R&D atau QA.'],
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('study_programs');
        Schema::dropIfExists('study_program_categories');
    }
};
