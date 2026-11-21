<?php

namespace App\Services\Psychometrics;

use App\Models\PsychometricTest;
use App\Models\RiasecAssessment;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SpreadsheetSyncService
{
    public function convertToCsvUrl(string $url): string
    {
        $url = trim($url);

        if (str_contains($url, 'output=csv') || str_contains($url, 'format=csv')) {
            return $url;
        }

        $gid = null;
        if (preg_match('/[?&#]gid=([0-9]+)/', $url, $gidMatch)) {
            $gid = $gidMatch[1];
        }

        if (preg_match('/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/', $url, $pubMatch)) {
            $base = "https://docs.google.com/spreadsheets/d/e/{$pubMatch[1]}/pub?output=csv";
            return $gid ? "{$base}&gid={$gid}" : $base;
        }

        if (preg_match('/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/', $url, $idMatch)) {
            $sheetId = $idMatch[1];
            $base = "https://docs.google.com/spreadsheets/d/{$sheetId}/export?format=csv";
            return $gid ? "{$base}&gid={$gid}" : $base;
        }

        return $url;
    }

    public function fetchCsvContent(string $spreadsheetUrl, int $timeoutSeconds = 25): array
    {
        $csvUrl = $this->convertToCsvUrl($spreadsheetUrl);

        try {
            $response = Http::timeout($timeoutSeconds)
                ->withOptions(['allow_redirects' => true])
                ->withoutVerifying()
                ->get($csvUrl);

            if (!$response->successful()) {
                return [
                    'success' => false,
                    'content' => null,
                    'message' => "Gagal mengunduh spreadsheet (HTTP {$response->status()}).",
                ];
            }

            $body = $response->body();
            $lowerBody = strtolower(substr($body, 0, 500));
            if (str_contains($lowerBody, '<!doctype html') || str_contains($lowerBody, '<html')) {
                return [
                    'success' => false,
                    'content' => null,
                    'message' => "Spreadsheet tidak dapat diakses publik. Pastikan pengaturan berbagi (sharing) Google Spreadsheet diatur ke 'Siapa saja yang memiliki link dapat melihat'.",
                ];
            }

            return [
                'success' => true,
                'content' => $body,
                'message' => null,
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'content' => null,
                'message' => $e->getMessage(),
            ];
        }
    }

    public function syncTest(PsychometricTest $test, int $timeoutSeconds = 25, bool $skipOlderInProgress = false): array
    {
        if (empty($test->spreadsheet_url)) {
            return [
                'success' => false,
                'message' => "Alat tes '{$test->name}' belum memiliki URL Spreadsheet.",
                'importedCount' => 0,
            ];
        }

        $fetch = $this->fetchCsvContent($test->spreadsheet_url, $timeoutSeconds);
        if (!$fetch['success']) {
            return [
                'success' => false,
                'message' => $fetch['message'],
                'importedCount' => 0,
            ];
        }

        return $this->processCsvContent($fetch['content'], $test->id, null, $skipOlderInProgress);
    }

    public function syncForStudent(PsychometricTest $test, User $student, int $timeoutSeconds = 10): array
    {
        if (empty($test->spreadsheet_url)) {
            return [
                'success' => false,
                'message' => "Alat tes '{$test->name}' belum memiliki URL Spreadsheet.",
                'importedCount' => 0,
            ];
        }

        $fetch = $this->fetchCsvContent($test->spreadsheet_url, $timeoutSeconds);
        if (!$fetch['success']) {
            return [
                'success' => false,
                'message' => $fetch['message'],
                'importedCount' => 0,
            ];
        }

        return $this->processCsvContent($fetch['content'], $test->id, $student);
    }

    public function syncPendingTestsIfNeeded(?User $student = null, int $cooldownSeconds = 60, int $timeoutSeconds = 8): void
    {
        $pendingTests = PsychometricTest::where('is_active', true)
            ->whereNotNull('spreadsheet_url')
            ->where('spreadsheet_url', '!=', '')
            ->whereHas('assessments', function ($q) use ($student) {
                if ($student !== null) {
                    $q->where('user_id', $student->id)
                        ->where('status', 'selesai');
                } else {
                    $q->whereIn('status', ['mengerjakan', 'selesai']);
                }

                $q->where(function ($sub) {
                    $sub->whereNull('dominant_code')
                        ->orWhere('dominant_code', '');
                })->where(function ($sub) {
                    $sub->whereNull('primary_result')
                        ->orWhere('primary_result', '');
                });
            })
            ->get();

        foreach ($pendingTests as $test) {
            $cacheKey = $student !== null
                ? "psychometric_sync_student_{$student->id}_{$test->id}"
                : "psychometric_sync_test_{$test->id}";

            if (Cache::has($cacheKey)) {
                continue;
            }

            Cache::put($cacheKey, true, now()->addSeconds($cooldownSeconds));

            try {
                if ($student !== null) {
                    $this->syncForStudent($test, $student, $timeoutSeconds);
                } else {
                    $this->syncTest($test, $timeoutSeconds, true);
                }
            } catch (\Throwable $e) {
                Log::warning("Auto-sync spreadsheet gagal untuk tes #{$test->id}: " . $e->getMessage());
            }
        }
    }

    public function processCsvContent(string $content, int $testId, ?User $targetStudent = null, bool $skipOlderInProgress = false): array
    {
        $content = trim($content);
        if ($content === '') {
            return [
                'success' => false,
                'message' => 'Konten spreadsheet kosong atau tidak dapat diunduh.',
                'importedCount' => 0,
            ];
        }

        $firstLine = strtok($content, "\r\n") ?: $content;
        $separator = ',';
        if (substr_count($firstLine, "\t") > substr_count($firstLine, ',')) {
            $separator = "\t";
        } elseif (substr_count($firstLine, ';') > substr_count($firstLine, ',')) {
            $separator = ';';
        }

        $stream = fopen('php://memory', 'r+');
        fwrite($stream, $content);
        rewind($stream);

        $rawHeaders = fgetcsv($stream, 0, $separator);
        if (empty($rawHeaders) || count($rawHeaders) < 2) {
            fclose($stream);
            return [
                'success' => false,
                'message' => 'Header kolom spreadsheet tidak valid atau tidak terbaca.',
                'importedCount' => 0,
            ];
        }

        $headers = array_map(function ($h) {
            return strtolower(trim(str_replace(['"', "'", "\xEF\xBB\xBF"], '', $h)));
        }, $rawHeaders);

        $emailIndex = -1;
        $mentorIndex = -1;
        $timestampIndex = -1;

        foreach ($headers as $idx => $header) {
            if (str_contains($header, 'email') || str_contains($header, 'surel') || str_contains($header, 'username')) {
                $emailIndex = $idx;
            } elseif (str_contains($header, 'guru') || str_contains($header, 'mentor') || str_contains($header, 'pembimbing')) {
                $mentorIndex = $idx;
            }

            if ($timestampIndex === -1 && (str_contains($header, 'timestamp') || str_contains($header, 'waktu') || str_contains($header, 'tanggal'))) {
                $timestampIndex = $idx;
            }
        }

        if ($emailIndex === -1) {
            fclose($stream);
            return [
                'success' => false,
                'message' => 'Kolom email tidak ditemukan dalam file. Pastikan terdapat kolom email (seperti "Email Resmi Google Workspace Gen-U").',
                'importedCount' => 0,
            ];
        }

        $parseTimestampToEpoch = function (?string $timestampStr, int $rowOrder): int {
            if (empty($timestampStr)) {
                return $rowOrder;
            }

            $timestampStr = trim($timestampStr);

            $d = \DateTime::createFromFormat('d/m/Y H:i:s', $timestampStr);
            if ($d !== false) {
                return $d->getTimestamp();
            }

            $d = \DateTime::createFromFormat('d/m/Y H:i', $timestampStr);
            if ($d !== false) {
                return $d->getTimestamp();
            }

            $d = \DateTime::createFromFormat('Y-m-d H:i:s', $timestampStr);
            if ($d !== false) {
                return $d->getTimestamp();
            }

            $time = strtotime($timestampStr);
            if ($time !== false && $time > 0) {
                return $time;
            }

            return $rowOrder;
        };

        $hasDataRows = false;
        $rowsByEmail = [];
        $lineIdx = 1;

        while (($row = fgetcsv($stream, 0, $separator)) !== false) {
            $lineIdx++;
            $nonEmpty = array_filter($row, fn ($v) => trim((string) $v) !== '');
            if (empty($nonEmpty)) {
                continue;
            }

            $hasDataRows = true;

            $email = isset($row[$emailIndex]) ? strtolower(trim($row[$emailIndex])) : '';
            if (empty($email)) {
                continue;
            }

            $timestampVal = ($timestampIndex !== -1 && isset($row[$timestampIndex])) ? $row[$timestampIndex] : null;
            $epoch = $parseTimestampToEpoch($timestampVal, $lineIdx);

            if (!isset($rowsByEmail[$email]) || $epoch > $rowsByEmail[$email]['epoch']) {
                $rowsByEmail[$email] = [
                    'row' => $row,
                    'epoch' => $epoch,
                ];
            }
        }
        fclose($stream);

        if (!$hasDataRows) {
            return [
                'success' => true,
                'message' => 'lembar spreadsheet saat ini belum memiliki respon jawaban siswa',
                'importedCount' => 0,
            ];
        }

        $test = PsychometricTest::find($testId);
        $manager = new PsychometricManager();
        $testType = $test ? $manager->resolveTypeForTest($test) : 'riasec';
        $driver = $manager->getDriver($testType);

        $importedCount = 0;

        foreach ($rowsByEmail as $email => $itemData) {
            $row = $itemData['row'];

            if ($targetStudent !== null) {
                if (!$this->emailMatchesUser($email, $targetStudent)) {
                    continue;
                }
                $user = $targetStudent;
            } else {
                $user = $this->findUserByEmail($email);
            }

            if (!$user) {
                continue;
            }

            $existingAssessment = RiasecAssessment::where('user_id', $user->id)
                ->where('psychometric_test_id', $testId)
                ->first();

            if (
                $skipOlderInProgress &&
                $existingAssessment &&
                $existingAssessment->status === 'mengerjakan' &&
                $existingAssessment->updated_at &&
                $itemData['epoch'] <= $existingAssessment->updated_at->timestamp
            ) {
                continue;
            }

            $existingMentor = $existingAssessment?->mentor_name;

            $mentorName = ($mentorIndex !== -1 && !empty(trim($row[$mentorIndex] ?? '')))
                ? trim($row[$mentorIndex])
                : ($existingMentor ?: ($user->selected_mentor ?: 'Bpk. Budi Santoso, M.Psi'));

            $calculation = $driver->calculate($rawHeaders, $row, $test?->config ?? []);

            $scoreR = null;
            $scoreI = null;
            $scoreA = null;
            $scoreS = null;
            $scoreE = null;
            $scoreC = null;

            if ($testType === 'riasec') {
                $dimScores = $calculation['dimension_scores'] ?? [];
                $scoreR = $dimScores['r'] ?? 0;
                $scoreI = $dimScores['i'] ?? 0;
                $scoreA = $dimScores['a'] ?? 0;
                $scoreS = $dimScores['s'] ?? 0;
                $scoreE = $dimScores['e'] ?? 0;
                $scoreC = $dimScores['c'] ?? 0;
            }

            $primaryResult = $calculation['primary_result'] ?? ($calculation['dominant_code'] ?? null);

            RiasecAssessment::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'psychometric_test_id' => $testId,
                ],
                [
                    'test_type' => $testType,
                    'score_r' => $scoreR,
                    'score_i' => $scoreI,
                    'score_a' => $scoreA,
                    'score_s' => $scoreS,
                    'score_e' => $scoreE,
                    'score_c' => $scoreC,
                    'dominant_code' => $calculation['dominant_code'] ?? $primaryResult,
                    'primary_result' => $primaryResult,
                    'dimension_scores' => $calculation['dimension_scores'] ?? null,
                    'raw_answers' => $calculation['raw_answers'] ?? null,
                    'interpretation' => $calculation['interpretation'] ?? null,
                    'mentor_name' => $mentorName,
                    'status' => 'selesai',
                    'completed_at' => now(),
                ]
            );

            $importedCount++;
        }

        if ($importedCount === 0) {
            return [
                'success' => true,
                'message' => 'terdapat data respon namun belum ada email yang cocok dengan siswa terdaftar',
                'importedCount' => 0,
            ];
        }

        return [
            'success' => true,
            'message' => "Berhasil mengimpor skor untuk {$importedCount} siswa.",
            'importedCount' => $importedCount,
        ];
    }

    private function findUserByEmail(string $email): ?User
    {
        $user = User::where('email', $email)
            ->orWhere('personal_email', $email)
            ->first();

        if ($user) {
            return $user;
        }

        return User::whereNotNull('registration_id')
            ->where('registration_id', '!=', '')
            ->where(function ($q) use ($email) {
                $q->whereRaw('? LIKE CONCAT("%", registration_id, "%")', [$email]);
            })
            ->first();
    }

    private function emailMatchesUser(string $email, User $user): bool
    {
        if (!empty($user->email) && strtolower(trim($user->email)) === $email) {
            return true;
        }

        if (!empty($user->personal_email) && strtolower(trim($user->personal_email)) === $email) {
            return true;
        }

        if (!empty($user->registration_id) && str_contains($email, strtolower(trim($user->registration_id)))) {
            return true;
        }

        return false;
    }
}
