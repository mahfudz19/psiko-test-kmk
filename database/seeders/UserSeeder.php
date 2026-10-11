<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'mahfudz@inbitef.ac.id'],
            [
                'name' => 'Mahfudz',
                'personal_email' => 'mahfudz@inbitef.ac.id',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'school' => 'Pusat Layanan Gen-U',
                'phone' => '0811-0000-0000',
                'npsn' => '00000000',
                'status' => 'active',
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin@gen.univeral.ac.id'],
            [
                'name' => 'Administrator Gen-U',
                'personal_email' => 'admin@gen.univeral.ac.id',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'school' => 'Pusat Layanan Gen-U',
                'phone' => '0811-0000-0001',
                'npsn' => '00000000',
                'status' => 'active',
            ]
        );
    }
}
