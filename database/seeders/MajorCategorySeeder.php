<?php

namespace Database\Seeders;

use App\Models\Major;
use App\Models\MajorCategory;
use Illuminate\Database\Seeder;

class MajorCategorySeeder extends Seeder
{
    public function run(): void
    {
        $saintek = MajorCategory::firstOrCreate(
            ['name' => 'Saintek'],
            ['description' => 'Mempelajari bidang sains, rekayasa, teknologi, dan ilmu pasti.']
        );

        $soshum = MajorCategory::firstOrCreate(
            ['name' => 'Soshum'],
            ['description' => 'Mempelajari aspek sosial, humaniora, komunikasi, dan bisnis masyarakat.']
        );

        $kesehatan = MajorCategory::firstOrCreate(
            ['name' => 'Kesehatan'],
            ['description' => 'Mempelajari ilmu medis, farmasi, kebidanan, dan perawatan kesehatan.']
        );

        Major::where('code', 's1-if')->update([
            'title' => 'Teknik Informatika',
            'category' => 'Saintek',
            'category_id' => $saintek->id,
            'teaser' => 'Mempelajari komputasi, algoritma, dan rekayasa perangkat lunak.',
            'description' => 'Mempelajari komputasi, algoritma, dan rekayasa perangkat lunak.',
            'study_activities' => ['Praktikum coding, proyek aplikasi, seminar teknologi.'],
            'career_prospects' => ['Software Engineer, Data Scientist, IT Consultant.'],
        ]);

        Major::where('code', 's1-komunikasi')->update([
            'title' => 'Ilmu Komunikasi',
            'category' => 'Soshum',
            'category_id' => $soshum->id,
            'teaser' => 'Mempelajari produksi dan distribusi pesan di berbagai media.',
            'description' => 'Mempelajari produksi dan distribusi pesan di berbagai media.',
            'study_activities' => ['Produksi konten, public speaking, riset media.'],
            'career_prospects' => ['Public Relations, Jurnalis, Content Strategist.'],
        ]);

        Major::whereIn('code', ['s1-si'])->update([
            'category' => 'Saintek',
            'category_id' => $saintek->id,
        ]);

        Major::whereIn('code', ['s1-manajemen', 's1-akuntansi', 's1-hukum'])->update([
            'category' => 'Soshum',
            'category_id' => $soshum->id,
        ]);

        Major::whereIn('code', ['d3-farmasi', 's1-farmasi', 'profesi-apoteker', 'd3-kebidanan', 's1-kebidanan', 'profesi-bidan'])->update([
            'category' => 'Kesehatan',
            'category_id' => $kesehatan->id,
        ]);
    }
}
