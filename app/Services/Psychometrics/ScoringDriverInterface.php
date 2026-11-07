<?php

namespace App\Services\Psychometrics;

interface ScoringDriverInterface
{
    public function getTestType(): string;

    public function calculate(array $rowHeaders, array $rowValues, array $config = []): array;

    public function generateRecommendations(array $dimensionScores, ?string $primaryResult = null): array;
}

