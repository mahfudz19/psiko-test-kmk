<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scholarships', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('organizer');
            $table->string('tag');
            $table->string('tag_color')->nullable()->default('bg-blue-100 text-blue-700');
            $table->string('border_color')->nullable()->default('#284f7a');
            $table->string('quota')->nullable();
            $table->string('image')->nullable();
            $table->json('summary_benefits')->nullable();
            $table->json('benefits')->nullable();
            $table->json('requirements')->nullable();
            $table->json('documents')->nullable();
            $table->string('deadline')->nullable();
            $table->string('status')->default('Aktif (Tampil)');
            $table->string('link_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scholarships');
    }
};
