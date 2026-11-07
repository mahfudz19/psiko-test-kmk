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
                'test_type' => 'riasec',
                'description' => 'Mengidentifikasi kecenderungan minat karier dan vokasional berdasarkan enam tipe kepribadian kerja.',
                'gform_url' => 'https://forms.gle/riasec-holland',
                'spreadsheet_url' => 'https://docs.google.com/spreadsheets/d/riasec-responses',
                'estimated_minutes' => 15,
                'order_num' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Tes Kecerdasan Majemuk',
                'test_type' => 'riasec',
                'description' => 'Memetakan potensi kecerdasan dominan sebagai dasar eksplorasi bidang studi.',
                'gform_url' => 'https://forms.gle/multiple-intelligence',
                'spreadsheet_url' => 'https://docs.google.com/spreadsheets/d/multiple-intelligence-responses',
                'estimated_minutes' => 15,
                'order_num' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'PAPI KostiK',
                'test_type' => 'papi_kostick',
                'description' => 'Inventori preferensi kepribadian kerja untuk memetakan peran, gaya kerja, kepemimpinan, dan kebutuhan di lingkungan akademik.',
                'gform_url' => 'https://docs.google.com/forms/d/e/1FAIpQLSdGUHZONAREWLRRoFwg0VHAKY7Yzaigai6qx8SSdsl99N3sSw/viewform',
                'spreadsheet_url' => 'https://docs.google.com/spreadsheets/d/1mgdsIbq11g81ta-keDcwsb3a0c3YJWGtGb1zsUPnptM/edit?usp=sharing',
                'estimated_minutes' => 20,
                'order_num' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'DiSC PSIKOTEST',
                'test_type' => 'disc',
                'description' => 'Mengidentifikasi kecenderungan profil perilaku: Dominance, Influence, Steadiness, dan Conscientiousness dalam interaksi kampus.',
                'gform_url' => 'https://docs.google.com/forms/d/e/1FAIpQLSfWkLsc0neG28xc0CP3RmScYjgSSK7LxCr2sgiPNFRnsd2LyA/viewform',
                'spreadsheet_url' => 'https://docs.google.com/spreadsheets/d/18MajAly15P3mCI7dmSKYeRwDI5OYG4NyKj2X8W_jGbI/edit?usp=sharing',
                'estimated_minutes' => 15,
                'order_num' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'SKALA MBTI',
                'test_type' => 'mbti',
                'description' => 'Menemukan 16 tipe kepribadian psikologis melalui 4 dimensi preferensi alami: E/I, S/N, T/F, dan J/P.',
                'gform_url' => 'https://docs.google.com/forms/d/e/1FAIpQLSfXpriHlPlBcM3Etg27jB1cy_C6kEA-MJh0ijdaRHpvbAQyOg/viewform',
                'spreadsheet_url' => 'https://docs.google.com/spreadsheets/d/1NXDgfk6cmM0CcmUgH9FhDP5zJ82_AcqcmtK45PB593Q/edit?usp=sharing',
                'estimated_minutes' => 15,
                'order_num' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($tests as $t) {
            PsychometricTest::updateOrCreate(
                ['name' => $t['name']],
                $t
            );
        }
    }
}
