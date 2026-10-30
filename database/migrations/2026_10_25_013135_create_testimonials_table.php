<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->string('role');
            $table->unsignedTinyInteger('rating')->default(5);
            $table->text('content');
            $table->string('avatar')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });

        DB::table('testimonials')->insert([
            [
                'name' => 'Budi Santoso',
                'role' => 'Siswa',
                'rating' => 5,
                'content' => 'Aplikasi ini sangat membantu saya dalam menentukan jurusan yang tepat untuk kuliah. Fitur tes minat bakatnya akurat!',
                'avatar' => null,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dr. Sarah Wijaya',
                'role' => 'Mentor',
                'rating' => 4,
                'content' => 'Sistem dashboard bagi mentor cukup jelas. Mungkin bisa ditambahkan fitur direct message antara mentor dan siswa agar lebih interaktif.',
                'avatar' => null,
                'is_published' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
