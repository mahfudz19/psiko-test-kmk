<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('riasec_assessments', function (Blueprint $table) {
            $table->dropColumn(['class_name', 'attendance_number']);
        });
    }

    public function down(): void
    {
        Schema::table('riasec_assessments', function (Blueprint $table) {
            $table->string('class_name')->nullable()->after('mentor_name');
            $table->string('attendance_number')->nullable()->after('class_name');
        });
    }
};
