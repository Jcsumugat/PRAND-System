<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ResetAdminPasswordSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')
            ->where('email', 'admin@prand.com') 
            ->update([
                'password' => Hash::make('admin123')
            ]);

        $this->command->info('Admin password has been reset!');
    }
}
