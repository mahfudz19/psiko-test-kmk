<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('riasec_assessments', function (Blueprint $table) {
            $table->integer('score_r')->nullable()->change();
            $table->integer('score_i')->nullable()->change();
            $table->integer('score_a')->nullable()->change();
            $table->integer('score_s')->nullable()->change();
            $table->integer('score_e')->nullable()->change();
            $table->integer('score_c')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('riasec_assessments', function (Blueprint $table) {
            $table->integer('score_r')->default(0)->change();
            $table->integer('score_i')->default(0)->change();
            $table->integer('score_a')->default(0)->change();
            $table->integer('score_s')->default(0)->change();
            $table->integer('score_e')->default(0)->change();
            $table->integer('score_c')->default(0)->change();
        });
    }
};
