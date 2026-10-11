<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('major_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::table('majors', function (Blueprint $table) {
            $table->string('category')->nullable()->after('group');
            $table->foreignId('category_id')->nullable()->after('category')->constrained('major_categories')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('majors', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn(['category_id', 'category']);
        });

        Schema::dropIfExists('major_categories');
    }
};
