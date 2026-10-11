<?php

namespace Database\Seeders;

use App\Models\PsychometricTest;
use Illuminate\Database\Seeder;

class PsychometricTestSeeder extends Seeder
{
    public function run(): void
    {
        $tests = [
            [
                'name' => 'Tes Holland (RIASEC)',
                'description' => 'Mengidentifikasi kecenderungan minat karier berdasarkan enam tipe kepribadian.',
                'gform_url' => 'https://forms.gle/riasec-holland',
                'spreadsheet_url' => 'https://docs.google.com/spreadsheets/d/riasec-responses',
                'estimated_minutes' => 15,
                'order_num' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Tes Kecerdasan Majemuk',
                'description' => 'Memetakan potensi kecerdasan dominan sebagai dasar eksplorasi bidang studi.',
                'gform_url' => 'https://forms.gle/multiple-intelligence',
                'spreadsheet_url' => 'https://docs.google.com/spreadsheets/d/multiple-intelligence-responses',
                'estimated_minutes' => 15,
                'order_num' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Inventori Gaya Belajar',
                'description' => 'Mengenali preferensi belajar visual, auditori, dan kinestetik peserta.',
                'gform_url' => 'https://forms.gle/learning-style',
                'spreadsheet_url' => 'https://docs.google.com/spreadsheets/d/learning-style-responses',
                'estimated_minutes' => 10,
                'order_num' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Tes Nilai Kerja',
                'description' => 'Membantu peserta memahami nilai dan lingkungan kerja yang paling sesuai.',
                'gform_url' => 'https://forms.gle/work-values',
                'spreadsheet_url' => 'https://docs.google.com/spreadsheets/d/work-values-responses',
                'estimated_minutes' => 12,
                'order_num' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($tests as $t) {
            PsychometricTest::firstOrCreate(['name' => $t['name']], $t);
        }
    }
}
