<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('psychometric_tests', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('gform_url');
            $table->string('spreadsheet_url')->nullable();
            $table->integer('estimated_minutes')->default(15);
            $table->integer('order_num')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::table('riasec_assessments', function (Blueprint $table) {
            $table->foreignId('psychometric_test_id')->nullable()->after('user_id')->constrained('psychometric_tests')->nullOnDelete();
            $table->string('mentor_name')->nullable()->after('status');
            $table->string('class_name')->nullable()->after('mentor_name');
            $table->string('attendance_number')->nullable()->after('class_name');
        });
    }

    public function down(): void
    {
        Schema::table('riasec_assessments', function (Blueprint $table) {
            $table->dropForeign(['psychometric_test_id']);
            $table->dropColumn(['psychometric_test_id', 'mentor_name', 'class_name', 'attendance_number']);
        });

        Schema::dropIfExists('psychometric_tests');
    }
};
