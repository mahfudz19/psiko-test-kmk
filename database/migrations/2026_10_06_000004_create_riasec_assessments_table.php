<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('riasec_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->integer('score_r')->default(0);
            $table->integer('score_i')->default(0);
            $table->integer('score_a')->default(0);
            $table->integer('score_s')->default(0);
            $table->integer('score_e')->default(0);
            $table->integer('score_c')->default(0);
            $table->string('dominant_code')->nullable();
            $table->string('status')->default('selesai');
            $table->json('answers')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('riasec_assessments');
    }
};
