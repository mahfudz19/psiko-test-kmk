<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scholarship_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('badge_color')->default('bg-blue-100 text-blue-700');
            $table->timestamps();
        });

        Schema::table('scholarships', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('id')->constrained('scholarship_categories')->nullOnDelete();
        });

        $cat1 = DB::table('scholarship_categories')->insertGetId([
            'name' => 'S1 Dalam Negeri',
            'badge_color' => 'bg-emerald-100 text-emerald-700',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $cat2 = DB::table('scholarship_categories')->insertGetId([
            'name' => 'Mahasiswa Aktif',
            'badge_color' => 'bg-blue-100 text-blue-700',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $cat3 = DB::table('scholarship_categories')->insertGetId([
            'name' => 'Bantuan UKT / Dana',
            'badge_color' => 'bg-amber-100 text-amber-800',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $cat4 = DB::table('scholarship_categories')->insertGetId([
            'name' => 'S2 / Luar Negeri',
            'badge_color' => 'bg-purple-100 text-purple-700',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('scholarships')->where('tag', 'S1 Dalam Negeri')->update(['category_id' => $cat1]);
        DB::table('scholarships')->where('tag', 'Mahasiswa Aktif')->update(['category_id' => $cat2]);
    }

    public function down(): void
    {
        Schema::table('scholarships', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });

        Schema::dropIfExists('scholarship_categories');
    }
};
