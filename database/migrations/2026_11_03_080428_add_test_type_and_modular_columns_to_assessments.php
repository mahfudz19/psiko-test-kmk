<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('psychometric_tests', function (Blueprint $table) {
            $table->string('test_type')->default('riasec')->after('name');
            $table->json('config')->nullable()->after('spreadsheet_url');
        });

        Schema::table('riasec_assessments', function (Blueprint $table) {
            $table->string('test_type')->default('riasec')->after('psychometric_test_id');
            $table->string('primary_result')->nullable()->after('dominant_code');
            $table->json('dimension_scores')->nullable()->after('primary_result');
            $table->json('raw_answers')->nullable()->after('answers');
            $table->json('interpretation')->nullable()->after('raw_answers');
            $table->timestamp('completed_at')->nullable()->after('updated_at');
        });
    }

    public function down(): void
    {
        Schema::table('riasec_assessments', function (Blueprint $table) {
            $table->dropColumn([
                'test_type',
                'primary_result',
                'dimension_scores',
                'raw_answers',
                'interpretation',
                'completed_at',
            ]);
        });

        Schema::table('psychometric_tests', function (Blueprint $table) {
            $table->dropColumn(['test_type', 'config']);
        });
    }
};
